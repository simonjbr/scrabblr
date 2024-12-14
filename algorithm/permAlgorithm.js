import wordArray from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';
import getWordScore from './data/score.js';
import getPermutaions from './data/permutations.js';
import getPermsFromCache from './data/getPermsFromCache.js';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
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

	// check for vertical anchors
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

	// check for horizontal anchors
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

	// valid letter placement deltas (relative to anchors)
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
	// try cache first otherwise generate new perms
	const permutations = getPermsFromCache().perms || getPermutaions(hand);

	const validWords = [];
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
				// try perm with each letter in the neighbour coord
				for (
					let xStartDelta = 0;
					xStartDelta < perm.permutation.length;
					xStartDelta++
				) {
					const xStart = n[1] + xStartDelta;
					if (xStart >= BOARD_LENGTH) break;

					// deep copy state
					const workingState = [];
					for (const row of state) workingState.push([...row]);
					// bounds check x-axis
					if (xStart - perm.permutation.length < 0) continue;
					// array of placed letters that contact anchors
					const verContacts = [];

					// bool for breaking early
					let isValidPerm = true;
					// placed letter coordinates for score calculation
					const placedLetters = [];
					// place letters in workingState
					for (let j = 0; j < perm.permutation.length; j++) {
						if (workingState[n[0]][xStart - j]) {
							isValidPerm = false;
							break;
						}
						// place letter
						workingState[n[0]][xStart - j] =
							perm.permutation[perm.permutation.length - 1 - j];
						// add letter and its coords to placedLetters
						placedLetters.push({
							letter: perm.permutation[
								perm.permutation.length - 1 - j
							],
							y: n[0],
							x: xStart - j,
							hasBonus: true,
						});
						// if placed letter contacts an anchor add to contacts
						// VERTICAL CONTACTS
						// check for contacts above
						if (workingState[n[0] - 1][xStart - j]) {
							// if there is contact above search for the top letter
							let yDelta = 1;
							while (workingState[n[0] - yDelta][xStart - j]) {
								yDelta++;
							}
							verContacts.push([n[0] - yDelta + 1, xStart - j]);
							// check for contacts below
						} else if (workingState[n[0] + 1][xStart - j]) {
							verContacts.push([n[0], xStart - j]);
						}
					}
					if (!isValidPerm) continue;

					// HORIZONTAL CONTACTS
					const horContacts = [];
					// check for contacts left
					if (workingState[n[0][xStart - perm.permutation.length]]) {
						let xDelta = 1;
						while (
							workingState[
								n[0][xStart - perm.permutation.length - xDelta]
							]
						) {
							xDelta++;
						}
						horContacts.push([
							n[0],
							xStart - perm.permutation.length - xDelta + 1,
						]);
						// check for contact right
					} else if (
						xStart + 1 < BOARD_LENGTH &&
						workingState[n[0]][xStart + 1]
					) {
						horContacts.push([
							n[0],
							xStart - perm.permutation.length + 1,
						]);
					}

					const words = [];
					if (
						wordArray.includes(perm.permutation.join('')) &&
						!horContacts.length
					)
						words.push({
							fullWord: perm.permutation.join(''),
							tiles: placedLetters,
						});
					// loop through contacts to find newly created words
					// vertical contacts
					for (const c of verContacts) {
						const word = {
							fullWord: '',
							tiles: [],
						};
						let yDelta = 0;
						while (
							c[0] + yDelta < BOARD_LENGTH &&
							workingState[c[0] + yDelta][c[1]]
						) {
							word.fullWord += workingState[c[0] + yDelta][c[1]];
							word.tiles.push({
								letter: workingState[c[0] + yDelta][c[1]],
								y: c[0] + yDelta,
								x: c[1],
								hasBonus: state[c[0] + yDelta][c[1]]
									? false
									: true,
							});
							yDelta++;
						}
						if (wordArray.includes(word.fullWord)) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (!isValidPerm) continue;

					// horizontal contacts
					for (const c of horContacts) {
						let word = {
							fullWord: '',
							tiles: [],
						};
						let xDelta = 0;
						while (
							c[1] + xDelta < BOARD_LENGTH &&
							workingState[c[0]][c[1] + xDelta]
						) {
							word.fullWord += workingState[c[0]][c[1] + xDelta];
							word.tiles.push({
								letter: workingState[c[0]][c[1] + xDelta],
								y: c[0],
								x: c[1] + xDelta,
								hasBonus: state[c[0]][c[1] + xDelta]
									? false
									: true,
							});
							xDelta++;
						}
						if (wordArray.includes(word.fullWord)) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (isValidPerm && words.length) {
						let validWord = [words, getWordScore(words)];
						validWords.push(validWord);
					}
				}
			}
		}
	}

	// now loop through horizontal anchors
	for (let i = 0; i < horAnchors.length; i++) {
		let [anchor, y, x] = horAnchors[i];

		for (const d of horDeltas) {
			// coords of anchor's neighbour
			const n = [
				y + d[0],
				d[1] < 0 ? x + d[1] : x + d[1] * anchor.length,
			];
			// if neighbour is occupied move on to next delta
			if (state[n[0]][n[1]]) continue;
			// loop through perms and try placing letters
			for (const perm of permutations) {
				// try perm with each letter in the neighbour coord
				for (
					let yStartDelta = 0;
					yStartDelta < perm.permutation.length;
					yStartDelta++
				) {
					const yStart = n[0] + yStartDelta; // const yStart = n[0] + yStartDelta
					if (yStart >= BOARD_LENGTH) break;

					// deep copy state
					const workingState = [];
					for (const row of state) workingState.push([...row]);
					// bounds check y-axis
					if (yStart - perm.permutation.length < 0) continue;
					// bool for breaking early
					let isValidPerm = true;

					// HORIZONTAL CONTACTS
					const horContacts = [];
					// placed letter coordinates for score calculation
					const placedLetters = [];
					// place letters in workingState
					for (let j = 0; j < perm.permutation.length; j++) {
						if (workingState[yStart - j][n[1]]) {
							isValidPerm = false;
							break;
						}
						// place letter
						workingState[yStart - j][n[1]] =
							perm.permutation[perm.permutation.length - 1 - j];
						// add letter and its coords to placedLetters
						placedLetters.push({
							letter: perm.permutation[
								perm.permutation.length - 1 - j
							],
							y: yStart - j,
							x: n[1],
							hasBonus: true,
						});
						// if placed letter contacts an anchor add to contacts
						// check for contacts left
						if (workingState[yStart - j][n[1] - 1]) {
							// if there is contact left search for the furthest left letter
							let xDelta = 1;
							while (workingState[yStart - j][n[1] - xDelta]) {
								xDelta++;
							}
							// verContacts.push([n[0] - yDelta + 1, xStart - j]);
							horContacts.push([yStart - j, n[1] - xDelta + 1]);
							// check for contacts right
						} else if (workingState[yStart - j][n[1] + 1]) {
							horContacts.push([yStart - j, n[1]]);
						}
					}
					// VERTICAL CONTACTS
					const verContacts = [];
					// check for contacts above
					if (
						workingState[yStart - perm.permutation.length][[n[1]]]
					) {
						// if found search for top letter
						let yDelta = 1;
						while (
							workingState[
								yStart - perm.permutation.length - yDelta
							][n[1]]
						) {
							yDelta++;
						}
						verContacts.push([
							yStart - perm.permutation.length - yDelta + 1,
							n[1],
						]);
						// check for contact below
					} else if (
						yStart + 1 < BOARD_LENGTH &&
						workingState[yStart + 1][n[1]]
					) {
						verContacts.push([
							yStart - perm.permutation.length + 1,
							n[1],
						]);
					}
					if (!isValidPerm) continue;

					const words = [];
					// make sure perm is on array if it is valid and isn't a component of another word
					if (
						wordArray.includes(perm.permutation.join('')) &&
						!verContacts.length
					)
						words.push({
							fullWord: perm.permutation.join(''),
							tiles: placedLetters,
						});

					// loop through contacts to find newly created words
					// VERTICAL CONTACTS
					for (const c of verContacts) {
						const word = {
							fullWord: '',
							tiles: [],
						};
						let yDelta = 0;
						while (
							c[0] + yDelta < BOARD_LENGTH &&
							workingState[c[0] + yDelta][c[1]]
						) {
							word.fullWord += workingState[c[0] + yDelta][c[1]];
							word.tiles.push({
								letter: workingState[c[0] + yDelta][c[1]],
								y: c[0] + yDelta,
								x: c[1],
								hasBonus: state[c[0] + yDelta][c[1]]
									? false
									: true,
							});
							yDelta++;
						}
						if (wordArray.includes(word.fullWord)) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (!isValidPerm) continue;

					// HORIZONTAL CONTACTS
					for (const c of horContacts) {
						let word = {
							fullWord: '',
							tiles: [],
						};
						let xDelta = 0;
						while (workingState[c[0]][c[1] + xDelta]) {
							word.fullWord += workingState[c[0]][c[1] + xDelta];
							word.tiles.push({
								letter: workingState[c[0]][c[1] + xDelta],
								y: c[0],
								x: c[1] + xDelta,
								hasBonus: state[c[0]][c[1] + xDelta]
									? false
									: true,
							});
							xDelta++;
						}
						if (wordArray.includes(word.fullWord)) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (isValidPerm && words.length) {
						let validWord = [words, getWordScore(words)];
						validWords.push(validWord);
					}
				}
			}
		}
	}

	validWords.sort((a, b) => b[1] - a[1]);

	// filter out repeats
	const filteredValidWords = [validWords[0]];
	const usedMoves = new Set();
	usedMoves.add(JSON.stringify(validWords[0]));
	let index = 1;
	while (filteredValidWords.length < 20) {
		const validWord = validWords[index];
		const move = JSON.stringify(validWord);
		if (!usedMoves.has(move)) {
			filteredValidWords.push(validWord);
			usedMoves.add(move);
		}
		index++;
	}

	return [filteredValidWords, validWords.length];
};

const hand = ['A', 'B', 'N', 'j', 'S', 'E', 'T'];
const validWords = getValidWords(hand, testState);
console.log(validWords);
