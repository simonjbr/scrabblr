import letterScores from './letterScores.js';
import createBoard from './board.js';

/**
 *
 * @param {String[]} words
 * @returns
 */

const board = createBoard();

const getWordScore = (words) => {
	let total = 0;
	for (const word of words) {
		let score = 0;
		let wordMultiplier = 1;

		for (const t of word.tiles) {
			let letterMultiplier = 1;

			if (t.hasBonus) {
				let bonus = board[t.y][t.x];

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

			if (!t.isJoker) score += letterScores[t.letter] * letterMultiplier;
		}
		total += score * wordMultiplier;
	}

	return total;
};

export default getWordScore;
