import letterScores from './letterScores.js';
import createBoard from './board.js';

/**
 *
 * @param {String[]} words
 * @param {number} tilesUsed
 * @returns
 */

const board = createBoard();

const getWordScore = (words, tilesUsed, gameType) => {
	let total = 0;
	for (const word of words) {
		let score = 0;
		let wordMultiplier = 1;

		for (const t of word.tiles) {
			let letterMultiplier = 1;

			if (t.hasBonus) {
				let bonus = board[gameType][t.y][t.x];

				switch (bonus) {
					case 'DL':
						letterMultiplier = 2;
						break;
					case 'TL':
						letterMultiplier = 3;
						break;
					case 'DW':
						wordMultiplier *= 2;
						break;
					case 'TW':
						wordMultiplier *= 3;
						break;
					default:
						break;
				}
			}

			if (!t.isJoker)
				score += letterScores[gameType][t.letter] * letterMultiplier;
		}
		word.score = score * wordMultiplier;
		total += score * wordMultiplier;
	}

	if (tilesUsed === 7) total += 50;

	return total;
};

export default getWordScore;
