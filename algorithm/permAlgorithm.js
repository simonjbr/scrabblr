import { wordArray, wordObj, wordObjStrings, trie } from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';
import getWordScore from './data/score.js';
import getPermutations from './data/permutations.js';
import getPermsFromCache from './data/getPermsFromCache.js';
import fs from 'node:fs';
import findNewWords from './data/findNewWords.js';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const BOARD_LENGTH = 15;

	console.time('Finding anchors');
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
				verAnchors.push([anchor, j - anchor.length, i, true]);
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
				horAnchors.push([anchor, i, j - anchor.length, false]);
				anchor = '';
			}
		}
	}
	const anchors = [...verAnchors, ...horAnchors];

	console.timeEnd('Finding anchors');

	// if there are no anchors we still need something to iterate over to
	// get into the for loop
	if (!anchors.length) {
		anchors.push(['', 7, 7, false]);
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

	console.time('Get permutations');
	// get permutations for hand
	// try cache first otherwise generate new perms
	// const permutations =
	// 	getPermsFromCache().permutations || getPermutations(hand);
	const permutations = getPermutations(hand);
	console.timeEnd('Get permutations');

	// fs.writeFileSync(
	// 	`./algorithm/data/cache/testPermutations.json`,
	// 	JSON.stringify({ permutations }),
	// 	'utf8'
	// );

	console.time('Get valid words');
	const validWords = [];
	console.time('Horizontal placements');
	const usedHorizontalPositions = new Set();
	// loop through vertical anchors and find valid permutations of letter
	// placement that touches at least that anchor
	for (let i = 0; i < anchors.length; i++) {
		let [anchor, y, x, isVertical] = anchors[i];

		let deltas = isVertical ? verDeltas : horDeltas;

		if (anchors.length === 1 && anchor === '') deltas = [[0, 0]];

		for (const d of deltas) {
			// coords of anchor's neighbour
			const n = [
				d[0] < 0 ? y + d[0] : y + d[0] * anchor.length,
				x + d[1],
			];
			// check if neighbour coords are out of bounds
			if (n[0] < 0 || n[1] < 0) break;
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
					let xStart = n[1] + xStartDelta;
					if (xStart >= BOARD_LENGTH) break;
					// if we lose contact with anchor
					if (xStart - perm.permutation.length >= n[1]) break;

					const position = `${perm.string}-${n[0]}-${xStart}`;
					if (usedHorizontalPositions.has(position)) {
						break;
					} else {
						usedHorizontalPositions.add(position);
					}

					// deep copy state
					const workingState = [];
					for (const row of state) workingState.push([...row]);
					// bounds check x-axis
					if (xStart - perm.permutation.length < 0) continue;
					// bool for breaking early
					let isValidPerm = true;

					// VERTICAL CONTACTS
					// array of placed letters that contact anchors above or below
					const verContacts = [];
					// placed letter coordinates for score calculation
					const placedLetters = [];
					let isIntersecting = false;
					let placedWord = '';
					let intersectionCount = 0;
					// place letters in workingState
					for (let j = perm.permutation.length - 1; j >= 0; j--) {
						// we need placed letters and intersected anchors
						if (xStart - j >= BOARD_LENGTH || xStart - j < 0) {
							isValidPerm = false;
							break;
						}
						if (workingState[n[0]][xStart - j]) {
							isIntersecting = true;
							while (
								xStart - j <= BOARD_LENGTH &&
								workingState[n[0]][xStart - j]
							) {
								intersectionCount++;
								placedWord += workingState[n[0]][xStart - j];
								xStart++;
							}
						}
						if (xStart - j >= BOARD_LENGTH || xStart - j < 0) {
							isValidPerm = false;
							break;
						}
						// place letter
						const letter =
							perm.permutation[perm.permutation.length - 1 - j];
						const isLetterJoker = letter === 'j';
						workingState[n[0]][xStart - j] = isLetterJoker
							? []
							: letter;
						placedWord += isLetterJoker ? 'j' : letter;
						// add letter and its coords to placedLetters
						placedLetters.push({
							letter: workingState[n[0]][xStart - j],
							y: n[0],
							x: xStart - j,
							hasBonus: true,
							isJoker: isLetterJoker,
						});
						// if placed letter contacts an anchor add to contacts
						// VERTICAL CONTACTS
						// check for contacts above
						if (
							n[0] - 1 >= 0 &&
							workingState[n[0] - 1][xStart - j]
						) {
							// if there is contact above search for the top letter
							let yDelta = 1;
							while (workingState[n[0] - yDelta][xStart - j]) {
								yDelta++;
								if (n[0] - yDelta < 0) break;
							}
							verContacts.push([n[0] - yDelta + 1, xStart - j]);
							// check for contacts below
						} else if (
							n[0] + 1 < BOARD_LENGTH &&
							workingState[n[0] + 1][xStart - j]
						) {
							verContacts.push([n[0], xStart - j]);
						}
					}
					if (!isValidPerm) break;

					// HORIZONTAL CONTACTS
					const horContacts = [];
					// check for contacts left
					if (
						workingState[n[0]][
							xStart - perm.permutation.length - intersectionCount
						]
					) {
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
					// make sure perm is on array if it is valid and isn't a component of another word
					if (perm.jokers && !horContacts.length && !isIntersecting) {
						const newWord = {
							fullWord: [],
							hasJoker: true,
						};
						// search trie for valid joker values
						const [isMatchFound, jokerValues] =
							trie.specialSearch(placedWord);
						// if found push all valid words to fullWord array
						if (isMatchFound) {
							const tempWords = [];
							for (let i = 0; i < jokerValues.length; i++) {
								const jokerValue = jokerValues[i];
								const jokerIndex = perm.jokerIndices[i];
								// update the placedLetters with valid joker values
								placedLetters[jokerIndex].letter.push(
									...jokerValue
								);
								// if more than 1 joker we need to do 2 rounds of j replacement (max 2 jokers)
								for (const jLetter of jokerValue) {
									if (perm.jokers === 1) {
										newWord.fullWord.push(
											placedWord.replace(/j/, jLetter)
										);
									} else if (i === 0) {
										tempWords.push(
											placedWord.replace(/j/, jLetter)
										);
									} else {
										for (let tempWord of tempWords) {
											newWord.fullWord.push(
												tempWord.replace(/j/, jLetter)
											);
										}
									}
								}
							}
							newWord.tiles = placedLetters;
							words.push(newWord);
						} else if (!horContacts.length && !isIntersecting) {
							isValidPerm = false;
							continue;
						}
					} else if (trie.search(placedWord)) {
						if (!horContacts.length)
							words.push({
								fullWord: placedWord,
								tiles: placedLetters,
								hasJoker: perm.jokers > 0, // should always be false
							});
					} else if (!horContacts.length) {
						isValidPerm = false;
						break;
					}

					// loop through contacts to find newly created words
					// vertical contacts
					if (verContacts.length)
						isValidPerm = findNewWords(
							state,
							workingState,
							verContacts,
							trie,
							'vertical',
							words
						);

					if (!isValidPerm) continue;

					// HORIZONTAL CONTACTS
					if (horContacts.length)
						isValidPerm = findNewWords(
							state,
							workingState,
							horContacts,
							trie,
							'horizontal',
							words
						);

					if (isValidPerm && words.length) {
						const move = {
							placedLetters: placedLetters,
							words: words,
							score: getWordScore(words, placedLetters.length),
						};
						validWords.push(move);
					}
				}
			}
		}
	}
	console.timeEnd('Horizontal placements');

	console.time('Vertical placements');
	const usedVerticalPositions = new Set();
	// now loop through horizontal anchors
	for (let i = 0; i < anchors.length; i++) {
		let [anchor, y, x, isVertical] = anchors[i];

		const deltas = isVertical ? verDeltas : horDeltas;

		for (const d of deltas) {
			// coords of anchor's neighbour
			const n = [
				y + d[0],
				d[1] < 0 ? x + d[1] : x + d[1] * anchor.length,
			];
			// check if neighbour coords are out of bounds
			if (n[0] < 0 || n[1] < 0) break;
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
					let yStart = n[0] + yStartDelta; // const yStart = n[0] + yStartDelta
					if (yStart >= BOARD_LENGTH) break;
					// if we lose contact with anchor
					if (yStart - perm.permutation.length >= n[0]) break;

					const position = `${perm.string}-${yStart}-${n[1]}`;
					if (usedVerticalPositions.has(position)) {
						continue;
					} else {
						usedVerticalPositions.add(position);
					}

					// deep copy state
					const workingState = [];
					for (const row of state) workingState.push([...row]);
					// bounds check y-axis
					if (yStart - perm.permutation.length < 0) continue;
					// bool for breaking early
					let isValidPerm = true;

					// HORIZONTAL CONTACTS
					// array of placed letters that contact anchors left or right
					const horContacts = [];
					// placed letter coordinates for score calculation
					const placedLetters = [];
					let isIntersecting = false;
					let placedWord = '';
					let intersectionCount = 0;
					// place letters in workingState
					for (let j = perm.permutation.length - 1; j >= 0; j--) {
						// we need placed letters and intersected anchors
						if (yStart - j >= BOARD_LENGTH || yStart - j < 0) {
							isValidPerm = false;
							break;
						}
						if (workingState[yStart - j][n[1]]) {
							isIntersecting = true;
							while (
								yStart - j < BOARD_LENGTH &&
								workingState[yStart - j][n[1]]
							) {
								intersectionCount++;
								placedWord += workingState[yStart - j][n[1]];
								yStart++;
							}
						}
						if (yStart - j >= BOARD_LENGTH || yStart - j < 0) {
							isValidPerm = false;
							break;
						}
						// place letter
						const letter =
							perm.permutation[perm.permutation.length - 1 - j];
						const isLetterJoker = letter === 'j';
						workingState[yStart - j][n[1]] = isLetterJoker
							? []
							: letter;
						placedWord += isLetterJoker ? 'j' : letter;
						// add letter and its coords to placedLetters
						placedLetters.push({
							letter: workingState[yStart - j][n[1]],
							y: yStart - j,
							x: n[1],
							hasBonus: true,
							isJoker: isLetterJoker,
						});
						// if placed letter contacts an anchor add to contacts
						// check for contacts left
						if (
							n[1] - 1 >= 0 &&
							workingState[yStart - j][n[1] - 1]
						) {
							// if there is contact left search for the furthest left letter
							let xDelta = 1;
							while (workingState[yStart - j][n[1] - xDelta]) {
								xDelta++;
								if (n[1] - xDelta < 0) break;
							}
							horContacts.push([yStart - j, n[1] - xDelta + 1]);
							// check for contacts right
						} else if (
							n[1] + 1 < BOARD_LENGTH &&
							workingState[yStart - j][n[1] + 1]
						) {
							horContacts.push([yStart - j, n[1]]);
						}
					}
					if (!isValidPerm) break;

					// VERTICAL CONTACTS
					const verContacts = [];
					// check for contacts above
					if (
						workingState[
							yStart - perm.permutation.length - intersectionCount
						][[n[1]]]
					) {
						// if found search for top letter
						let yDelta = 1;
						while (
							yStart - perm.permutation.length - yDelta > 0 &&
							workingState[
								yStart - perm.permutation.length - yDelta
							][n[1]]
						) {
							yDelta++;
							if (yStart - perm.permutation.length - yDelta < 0)
								break;
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
					if (perm.jokers && !horContacts.length && !isIntersecting) {
						const newWord = {
							fullWord: [],
							hasJoker: true,
						};
						// search trie for valid joker values
						const [isMatchFound, jokerValues] =
							trie.specialSearch(placedWord);
						// if found push all valid words to fullWord array
						if (isMatchFound) {
							const tempWords = [];
							for (let i = 0; i < jokerValues.length; i++) {
								const jokerValue = jokerValues[i];
								const jokerIndex = perm.jokerIndices[i];
								// update the placedLetters with valid joker values
								placedLetters[jokerIndex].letter.push(
									...jokerValue
								);
								// if more than 1 joker we need to do 2 rounds of j replacement (max 2 jokers)
								for (const jLetter of jokerValue) {
									if (perm.jokers === 1) {
										newWord.fullWord.push(
											placedWord.replace(/j/, jLetter)
										);
									} else if (i === 0) {
										tempWords.push(
											placedWord.replace(/j/, jLetter)
										);
									} else {
										for (let tempWord of tempWords) {
											newWord.fullWord.push(
												tempWord.replace(/j/, jLetter)
											);
										}
									}
								}
							}
							newWord.tiles = placedLetters;
							words.push(newWord);
						} else if (!verContacts.length && !isIntersecting) {
							// otherwise perm is invalid and we break early
							isValidPerm = false;
							continue;
						}
					} else if (trie.search(placedWord)) {
						if (!verContacts.length)
							words.push({
								fullWord: placedWord,
								tiles: placedLetters,
								hasJoker: perm.jokers > 0, // should always be false
							});
					} else if (!verContacts.length) {
						isValidPerm = false;
						break;
					}

					// loop through contacts to find newly created words
					// VERTICAL CONTACTS
					if (verContacts.length)
						isValidPerm = findNewWords(
							state,
							workingState,
							verContacts,
							trie,
							'vertical',
							words
						);

					if (!isValidPerm) continue;

					// HORIZONTAL CONTACTS
					if (horContacts.length)
						isValidPerm = findNewWords(
							state,
							workingState,
							horContacts,
							trie,
							'horizontal',
							words
						);

					if (isValidPerm && words.length) {
						const move = {
							placedLetters: placedLetters,
							words: words,
							score: getWordScore(words, placedLetters.length),
						};
						validWords.push(move);
					}
				}
			}
		}
	}
	console.timeEnd('Vertical placements');
	console.timeEnd('Get valid words');

	console.time('Sort and filter');
	validWords.sort((a, b) => b.score - a.score);

	// filter out repeats
	const filteredValidWords = [validWords[0]];
	const usedMoves = new Set();
	usedMoves.add(JSON.stringify(validWords[0]));
	let index = 1;
	while (index < validWords.length) {
		const validWord = validWords[index];
		const move = JSON.stringify(validWord);
		if (!usedMoves.has(move)) {
			filteredValidWords.push(validWord);
			usedMoves.add(move);
		}
		index++;
	}
	console.timeEnd('Sort and filter');

	return [filteredValidWords, validWords.length, filteredValidWords.length];
};

// const hand = ['A', 'B', 'N', 'j', 'S', 'j', 'T'];
// console.log('hand:', hand);
// console.time('Total runtime');
// const validWords = getValidWords(hand, testState);
// console.timeEnd('Total runtime');
// console.log(validWords);
// for (const validWord of validWords) {
// 	console.log(JSON.stringify(validWord, null, '\t'));
// }

// fs.writeFileSync(
// 	`./algorithm/data/cache/cachedResults.json`,
// 	JSON.stringify({ validWords }),
// 	'utf8'
// );

export default getValidWords;
