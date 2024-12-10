import createBoard from './data/board.js';
import wordArray from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';
import getWordScore from './data/score.js';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const board = createBoard();

	const BOARD_LENGTH = 15;

	// generate array of existing characters that must be attached to
	// I'll call them anchors
	const anchors = [];
	for (let i = 0; i < BOARD_LENGTH; i++) {
		const row = state[i];
		for (let j = 0; j < BOARD_LENGTH; j++) {
			const char = row[j];
			if (char) {
				anchors.push([char, i, j]);
			}
		}
	}

	// console.log('single anchors:', anchors);

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

	const validWords = [];

	// valid letter placement deltas (relative to anchors)
	const deltas = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];

	// vertical deltas
	const verDeltas = [
		[-1, 0],
		[1, 0],
	];

	// horizontal deltas
	const horDeltas = [
		[0, 1],
		[0, -1],
	];

	// get permutations for hand
	const permutations = getPermutaions(hand);

	// loop through vertical anchors and find valid permutations of letter
	// placement that touches at least that anchor
	for (let i = 0; i < verAnchors.length; i++) {
		let [anchor, y, x] = verAnchors[i];

		for (const d of verDeltas) {
			// coords of anchor's neighbour
			const n = [
				d[0] < 0 ? y + d[0] : y + d[0] * anchor.length,
				x + d[1],
			];
			// if neighbour is occupied move on to next delta
			if (state[n[0]][n[1]]) continue;
			// loop through perms and try placing letters
			for (const perm of permutations) {
				// deep copy state
				const workingState = [];
				for (const row of state) workingState.push([...row]);
				// bounds check x-axis
				if (n[1] - perm.length < 0) continue;
				// array of placed letters that contact anchors
				const verContacts = [];

				// bool for breaking early
				let isValidPerm = true;
				// place letters in workingState
				for (let j = 0; j < perm.length; j++) {
					if (workingState[n[0]][n[1] - j]) {
						isValidPerm = false;
						break;
					}
					workingState[n[0]][n[1] - j] = perm[perm.length - 1 - j];
					// if placed letter contacts an anchor add to contacts
					// VERTICAL CONTACTS
					// check for contacts above
					if (workingState[n[0] - 1][n[1] - j]) {
						// if there is contact above search for the top letter
						let yDelta = 1;
						while (workingState[n[0] - yDelta][n[1] - j]) {
							yDelta++;
						}
						verContacts.push([n[0] - yDelta + 1, n[1] - j]);
						// check for contacts below
					} else if (workingState[n[0] + 1][n[1] - j]) {
						verContacts.push([n[0], n[1] - j]);
					}
				}
				if (!isValidPerm) continue;
				// HORIZONTAL CONTACTS
				const horContacts = [];
				if (perm.length === 1 && perm[0] === 'B' && anchor === 'E') {
					console.log('');
				}
				// check for contacts left
				if (workingState[n[0][n[1] - perm.length]]) {
					let xDelta = 1;
					while (workingState[n[0][n[1] - perm.length - xDelta]]) {
						xDelta++;
					}
					horContacts.push([n[0], n[1] - perm.length - xDelta + 1]);
					// check for contact right
				} else if (workingState[n[0]][n[1] + 1]) {
					horContacts.push([n[0], n[1] - perm.length + 1]);
				}

				const words = [];
				if (wordArray.includes(perm.join('')) && !horContacts.length)
					words.push(perm.join(''));
				// loop through contacts to find newly created words
				// vertical contacts
				for (const c of verContacts) {
					// let [y, x] = c;
					let word = '';
					let yDelta = 0;
					while (workingState[c[0] + yDelta][c[1]]) {
						word += workingState[c[0] + yDelta][c[1]];
						yDelta++;
					}
					if (wordArray.includes(word)) {
						words.push(word);
					} else {
						isValidPerm = false;
						break;
					}
				}

				if (!isValidPerm) continue;

				// horizontal contacts
				for (const c of horContacts) {
					let word = '';
					let xDelta = 0;
					while (workingState[c[0]][c[1] + xDelta]) {
						word += workingState[c[0]][c[1] + xDelta];
						xDelta++;
					}
					if (wordArray.includes(word)) {
						words.push(word);
					} else {
						isValidPerm = false;
						break;
					}
				}

				if (isValidPerm && words.length) {
					validWords.push([words, getWordScore(words)]);
				}

				// const compoundWord = anchor + perm[perm.length - 1];
				// if (wordArray.includes(compoundWord)) {
				// 	const newWords = [perm.join(''), compoundWord];
				// 	validWords.push([newWords, getWordScore(newWords)]);
				// }
			}
		}
	}

	return validWords.sort((a, b) => b[1] - a[1]).slice(0, 50);
	// return validWords;
};

const getPermutaions = (hand) => {
	const results = [];

	// helper function to generate subsets of hand
	const generateSubsets = (subset, start) => {
		// generate permutations for each subset
		if (subset.length > 0) {
			results.push(...permute(subset));
		}
		for (let i = start; i < hand.length; i++) {
			generateSubsets([...subset, hand[i]], i + 1);
		}
	};

	// helper function to generate permutations of the subset
	const permute = (arr) => {
		if (arr.length === 1) return [arr];

		const permutations = [];
		for (let i = 0; i < arr.length; i++) {
			const current = arr[i];
			// slice out current letter
			const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
			for (const perm of permute(remaining)) {
				const p = [current, ...perm];
				// if its a valid word push it to permutations
				if (wordArray.includes(p.join('')))
					permutations.push([current, ...perm]);
			}
		}
		return permutations;
	};

	generateSubsets([], 0);
	return results;
};

const hand = ['A', 'B', 'N', 'P', 'S', 'E', 'T'];
const validWords = getValidWords(hand, testState);
console.log(validWords);
