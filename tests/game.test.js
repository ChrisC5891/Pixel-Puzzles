const PixelPuzzles = require('../src/game');
jest.mock('axios');
const axios = require('axios');

describe('PixelPuzzles', () => {
  let game;

  beforeEach(async () => {
    game = new PixelPuzzles('fake-api-key');

    axios.get.mockImplementation(url => {
      if (url.includes('/games?')) {
        return Promise.resolve({
          data: {
            results: [{ id: 1, name: "Grand Theft Auto V", released: "2013-09-17" }]
          }
        });
      }
      if (url.includes('/screenshots')) {
        return Promise.resolve({
          data: {
            results: [{ image: "img1.jpg" }, { image: "img2.jpg" }]
          }
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await game.startGame();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('starts with 5 guesses and an image', () => {
    expect(game.guessesLeft).toBe(5);
    expect(game.images[0]).toBe("img1.jpg");
  });

  test('correct guess wins with message and emoji', () => {
    const result = game.guess("Grand Theft Auto V");
    expect(result.success).toBe(true);
    expect(result.message).toBe("Well done! 👍");
    expect(result.gameOver).toBe(true);
  });

  test('wrong guess decreases guesses, gives clue and new image', () => {
    const result = game.guess("Sonic");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Clue: Released in 2013");
    expect(result.image).toBe("img2.jpg");
    expect(game.guessesLeft).toBe(4);
  });

  test('related guess turns background pale green', () => {
    const result = game.guess("Grand Theft Auto: San Andreas");
    expect(result.background).toBe("paleGreen");
  });

  test('5 wrong guesses ends game', () => {
    game.guess("Sonic");
    game.guess("Zelda");
    game.guess("Pokemon");
    game.guess("Halo");
    const result = game.guess("Call of Duty");
    expect(result.gameOver).toBe(true);
    expect(result.message).toContain("Game over! It was Grand Theft Auto V");
  });

  test('dropdown filters games', () => {
    const options = game.getDropdownOptions("grand");
    expect(options).toContain("grand theft auto v");
  });
});