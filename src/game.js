import axios from 'axios';

class PixelPuzzles {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.targetGame = null;
    this.guessesLeft = 5;
    this.guesses = [];
    this.images = [];
    this.currentImageIndex = 0;
    this.clues = [];
    this.allGames = [];
    this.playedGames = new Set();
  }

  async fetchAllGames() {
    let allGames = [];
    const pageSize = 100;
    const maxPages = 50;
    for (let page = 1; page <= maxPages; page++) {
      const response = await axios.get(`/rawg/games?key=${this.apiKey}&page_size=${pageSize}&page=${page}`);
      allGames = allGames.concat(response.data.results.map(game => game.name.toLowerCase()));
    }
    this.allGames = allGames;
    return allGames;
  }

  async startGame(playedGames = []) {
    if (!this.allGames.length) {
      await this.fetchAllGames();
    }
    this.playedGames = new Set(playedGames);
    let availableGames = this.allGames.filter(game => !this.playedGames.has(game));
    if (availableGames.length === 0) {
      availableGames = this.allGames;
      this.playedGames.clear();
    }
    try {
      const response = await axios.get(`/rawg/games?key=${this.apiKey}&page_size=100`);
      const games = response.data.results.filter(game => !this.playedGames.has(game.name.toLowerCase()));
      this.targetGame = games[Math.floor(Math.random() * games.length)] || response.data.results[0];
      const screenshots = await axios.get(`/rawg/games/${this.targetGame.id}/screenshots?key=${this.apiKey}`);
      this.images = screenshots.data.results.map(s => s.image) || ['https://via.placeholder.com/300?text=No+Image'];
      this.clues = [
        "Released in " + (this.targetGame.released?.substring(0, 4) || "unknown year"),
        "Platform: " + (this.targetGame.platforms?.[0]?.platform?.name || "unknown"),
        "Genre: " + (this.targetGame.genres?.[0]?.name || "unknown"),
        "Developer: " + (this.targetGame.developers?.[0]?.name || "unknown"),
      ];
      this.guessesLeft = 5;
      this.guesses = [];
      this.currentImageIndex = 0;
      this.playedGames.add(this.targetGame.name.toLowerCase());
      return { image: this.images[0] || 'https://via.placeholder.com/300?text=No+Image', guessesLeft: 5 };
    } catch (error) {
      console.error('startGame failed:', error.message, error.response?.data);
      this.images = ['https://via.placeholder.com/300?text=Error'];
      return { image: this.images[0], guessesLeft: 5 };
    }
  }

  guess(gameName) {
    if (this.guessesLeft <= 0) return { success: false, message: "Game over! No guesses left.", gameOver: true, score: 0 };
    const guessLower = gameName.toLowerCase();
    const targetLower = this.targetGame.name.toLowerCase();
    this.guesses.push(guessLower);
    this.guessesLeft--;
    if (guessLower === targetLower) {
      const score = this.guessesLeft + 1;
      return { success: true, message: `Well done! Score: ${score}`, gameOver: true, background: "paleGreen", score };
    }
    const isRelated = guessLower.includes(targetLower.split(" ")[0]);
    this.currentImageIndex = Math.min(this.currentImageIndex + 1, this.images.length - 1);
    const nextImage = this.images[this.currentImageIndex] || 'https://via.placeholder.com/300?text=No+Image';
    const clue = this.clues.shift() || "No more clues!";
    if (this.guessesLeft === 0) {
      return { success: false, message: `Game over! It was ${this.targetGame.name}. Score: 0`, image: nextImage, gameOver: true, score: 0 };
    }
    return {
      success: false,
      message: `Wrong! Clue: ${clue}`,
      image: nextImage,
      guessesLeft: this.guessesLeft,
      background: isRelated ? "paleGreen" : "red",
      score: 0
    };
  }

  getDropdownOptions(input) {
    return this.allGames.filter(name => name.includes(input.toLowerCase()));
  }

  getPlayedGames() {
    return Array.from(this.playedGames);
  }
}

export default PixelPuzzles;