const axios = require('axios');

class PixelPuzzles {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.targetGame = null;
    this.guessesLeft = 5;
    this.guesses = [];
    this.images = [];
    this.currentImageIndex = 0;
    this.clues = [];
    this.allGames = []; // For dropdown
  }

  async startGame() {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${this.apiKey}&page_size=100`);
    const games = response.data.results;
    this.allGames = games.map(game => game.name.toLowerCase());
    this.targetGame = games[Math.floor(Math.random() * games.length)];
    const screenshots = await axios.get(`https://api.rawg.io/api/games/${this.targetGame.id}/screenshots?key=${this.apiKey}`);
    this.images = screenshots.data.results.map(s => s.image);
    this.clues = ["Released in " + this.targetGame.released.substring(0, 4)];
    this.guessesLeft = 5;
    this.guesses = [];
    this.currentImageIndex = 0;
    return { image: this.images[0], guessesLeft: 5 };
  }

  guess(gameName) {
    if (this.guessesLeft <= 0) return { success: false, message: "Game over! No guesses left.", gameOver: true };

    const guessLower = gameName.toLowerCase();
    const targetLower = this.targetGame.name.toLowerCase();
    this.guesses.push(guessLower);
    this.guessesLeft--;

    if (guessLower === targetLower) {
      return { success: true, message: "Well done! 👍", gameOver: true, background: "paleGreen" };
    }

    const isRelated = guessLower.includes(targetLower.split(" ")[0]);
    this.currentImageIndex = Math.min(this.currentImageIndex + 1, this.images.length - 1);
    const nextImage = this.images[this.currentImageIndex];
    const clue = this.clues.shift() || "No more clues!";

    if (this.guessesLeft === 0) {
      return { success: false, message: `Game over! It was ${this.targetGame.name}.`, image: nextImage, gameOver: true };
    }

    return {
      success: false,
      message: `Wrong! Clue: ${clue}`,
      image: nextImage,
      guessesLeft: this.guessesLeft,
      background: isRelated ? "paleGreen" : "white"
    };
  }

  getDropdownOptions(input) {
    return this.allGames.filter(name => name.includes(input.toLowerCase()));
  }
}

module.exports = PixelPuzzles;