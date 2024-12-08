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

	// valid letter placement deltas (relative to anchors)
	const neighbours = [
		[-1, 0],
		[0, 1],
		[-1, 0],
		[0, -1],
	];

	// loop through anchors and find valid permutations of letter
	// placement that touches at least that anchor
	for (let i = 0; i < anchors.length; i++) {
		const [anchor, y, x] = anchors[i];
	}
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
const permutations = getPermutaions(hand);

console.log(permutations);
