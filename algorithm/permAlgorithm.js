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

	console.log('single anchors:', anchors);

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

	const validWords = [];

	// valid letter placement deltas (relative to anchors)
	const deltas = [
		[-1, 0],
		[0, 1],
		[-1, 0],
		[0, -1],
	];

	// get permutations for hand
	const permutations = getPermutaions(hand);

	// loop through anchors and find valid permutations of letter
	// placement that touches at least that anchor
	for (let i = 0; i < verAnchors.length; i++) {
		const [anchor, y, x] = verAnchors[i];

		for (const d of deltas) {
			// coords of anchor's neighbour
			const n = [y + d[0], x + d[1]];
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
				const contacts = [];
				// place letters in workingState
				for (let j = 0; j < perm.length; j++) {
					if (workingState[n[0]][n[1] - j]) break;
					workingState[n[0]][n[1] - j] = perm[perm.length - 1 - j];
					// if placed letter contacts an anchor add to contacts
					if (workingState[n[0] + 1][n[1] - j])
						contacts.push([n[0], n[1] - j]);
				}

				let isValidPerm = true;

				// loop through contacts to find newly created words
				const words = [];
				for (const c of contacts) {
					let [y, x] = c;
					let word = '';
					while (workingState[y][x]) {
						word += workingState[y][x];
						y++;
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

	return validWords.sort((a, b) => b[1] - a[1]).slice(0, 10);
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
