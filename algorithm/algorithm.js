import tiles from './data/tiles.js';
import createBoard from './data/board.js';
import wordArray from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';
import test from 'node:test';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const board = createBoard();

	// generate array of existing characters (or words) that must be attached to
	// I'll call them anchors
	// check horizontal
	const horAnchors = [];
	for (let i = 0; i < state.length; i++) {
		const row = state[i];
		let anchor = '';
		for (let j = 0; j < row.length; j++) {
			const char = row[j];
			if (char) {
				anchor += char;
			} else if (anchor) {
				horAnchors.push(anchor);
				anchor = '';
			}
		}
	}

	// check vertical
	const verAnchors = [];
	for (let i = 0; i < 15; i++) {
		let anchor = '';
		for (let j = 0; j < 15; j++) {
			const char = state[j][i];
			if (char) {
				anchor += char;
			} else if (anchor) {
				verAnchors.push(anchor);
				anchor = '';
			}
		}
	}
	console.log(verAnchors);

	// find words that include letters in hand
	let horValidWords = [];
	for (const anchor of horAnchors) {
		for (let i = 0; i < wordArray.length; i++) {
			// TODO: fix the anchor logic
			let remainingHand = [...hand, anchor];
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
			if (isValid) horValidWords.push([word, getWordScore(word)]);
		}
	}
	console.log(horValidWords.filter((word) => word[0].includes('L')));
	horValidWords = horValidWords.sort((a, b) => b[1] - a[1]).toSpliced(10);

	console.log(horValidWords);
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
