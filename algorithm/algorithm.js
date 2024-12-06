import tiles from './data/tiles.js';
import createBoard from './data/board.js';
import wordArray from './data/words.js';
import createEmptyState from './data/emptyState.js';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const board = createBoard();

	// find words that include letters in hand
	const validWords = [];
	for (let i = 0; i < wordArray.length; i++) {
		let remainingHand = hand;
		const word = wordArray[i];
		let isValid = true;
		for (let j = 0; j < word.length; j++) {
			const char = word.charAt(j);
			if (remainingHand.includes(char)) {
				const charIndex = remainingHand.indexOf(char);
				remainingHand = [
					...remainingHand.slice(0, charIndex),
					...remainingHand.slice(charIndex + 1),
				];
			} else {
				isValid = false;
				break;
			}
		}
		if (isValid) validWords.push([word, getWordScore(word)]);
	}

	console.log(validWords);
};

/**
 *
 * @param {String} word
 * @returns
 */

const getWordScore = (word) => {
	const chars = word.split('');
	let score = 0;

	for (const c of chars) {
		score += tiles[c];
	}

	return score;
};

getValidWords(['A', 'B', 'N', 'P', 'S', 'E', 'T'], createEmptyState());
