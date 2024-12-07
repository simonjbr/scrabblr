import tiles from './data/tiles.js';
import createBoard from './data/board.js';
import wordArray from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const board = createBoard();

	const BOARD_LENGTH = 15;

	// generate array of existing characters (or words) that must be attached to
	// I'll call them anchors

	// check horizontal
	const horAnchors = [];
	for (let i = 0; i < BOARD_LENGTH; i++) {
		const row = state[i];
		let anchor = '';
		for (let j = 0; j < BOARD_LENGTH; j++) {
			const char = row[j];
			if (char) {
				anchor += char;
			} else if (anchor) {
				// push anchor and the indices of the first char to array
				horAnchors.push([anchor, i, j - anchor.length]);
				anchor = '';
			}
		}
	}

	// check vertical
	const verAnchors = [];
	for (let i = 0; i < BOARD_LENGTH; i++) {
		let anchor = '';
		for (let j = 0; j < BOARD_LENGTH; j++) {
			const char = state[j][i];
			if (char) {
				anchor += char;
			} else if (anchor) {
				// push anchor and the indices of the first char to array
				verAnchors.push([anchor, j - anchor.length, i]);
				anchor = '';
			}
		}
	}
	console.log(verAnchors);

	// find words that include letters in hand and anchors
	let horValidWords = [];
	for (const anchor of horAnchors) {
		for (let i = 0; i < wordArray.length; i++) {
			let remainingHand = hand;
			const word = wordArray[i];
			let isValid = true;

			// check word contains anchor
			if (word.includes(anchor[0])) {
				// remove anchor from word
				const remainingWord =
					word.slice(0, word.indexOf(anchor[0])) +
					word.slice(word.indexOf(anchor[0]) + anchor[0].length);
				// now check word contains only letters in hand
				for (let j = 0; j < remainingWord.length; j++) {
					const char = remainingWord.charAt(j);
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
				if (isValid) horValidWords.push([word, getWordScore(word)]);
			}
		}
	}
	horValidWords = horValidWords.sort((a, b) => b[1] - a[1]).toSpliced(10);

	console.log('horValidWords:', horValidWords);

	let verValidWords = [];
	for (const anchor of verAnchors) {
		for (let i = 0; i < wordArray.length; i++) {
			let remainingHand = hand;
			const word = wordArray[i];
			let isValid = true;

			// check word contains anchor
			if (word.includes(anchor[0])) {
				// remove anchor from word
				const remainingWord =
					word.slice(0, word.indexOf(anchor[0])) +
					word.slice(word.indexOf(anchor[0]) + anchor[0].length);
				// now check word contains only letters in hand
				for (let j = 0; j < remainingWord.length; j++) {
					const char = remainingWord.charAt(j);
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
				if (isValid) verValidWords.push([word, getWordScore(word)]);
			}
		}
	}
	verValidWords = verValidWords.sort((a, b) => b[1] - a[1]).toSpliced(10);

	console.log('verValidWords:', verValidWords);
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

getValidWords(['A', 'B', 'N', 'P', 'S', 'E', 'T'], testState);
