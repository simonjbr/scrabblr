import tiles from './tiles.js';

/**
 *
 * @param {String[]} words
 * @returns
 */

const getWordScore = (words) => {
	let score = 0;
	for (const word of words) {
		const chars = word.split('');

		for (const c of chars) {
			score += tiles[c];
		}
	}

	return score;
};

export default getWordScore;
