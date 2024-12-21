import { wordArray, wordObj } from './data/words.js';
import { createEmptyState, testState } from './data/emptyState.js';
import getWordScore from './data/score.js';
import getPermutations from './data/permutations.js';
import getPermsFromCache from './data/getPermsFromCache.js';
import fs from 'node:fs';

/**
 *
 * @param {String[]} hand
 */

const getValidWords = (hand, state) => {
	const BOARD_LENGTH = 15;

	console.time('Finding anchors');
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

	console.timeEnd('Finding anchors');

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
	// const permutations = getPermsFromCache().perms || getPermutations(hand);
	const permutations = getPermutations(hand);
	console.timeEnd('Get permutations');

	console.time('Get valid words');
	const validWords = [];
	console.time('Horizontal placements');
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
					// bool for breaking early
					let isValidPerm = true;

					// VERTICAL CONTACTS
					// array of placed letters that contact anchors above or below
					const verContacts = [];
					// placed letter coordinates for score calculation
					const placedLetters = [];
					// place letters in workingState
					for (let j = perm.permutation.length - 1; j >= 0; j--) {
						if (workingState[n[0]][xStart - j]) {
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
					let isMatchFound = false;
					if (perm.jokers) {
						const jokerRegExp = new RegExp(perm.string);
						const newWord = {
							fullWord: [],
							hasJoker: true,
						};
						// search wordArray for valid joker letters
						for (const word of wordObj[perm.permutation.length]) {
							if (
								word.length === perm.permutation.length &&
								jokerRegExp.test(word)
							) {
								// push valid joker letters to the placed letter or each joker
								for (const jokerIndex of perm.jokerIndices) {
									placedLetters[jokerIndex].letter.push(
										word[jokerIndex]
									);
									newWord.fullWord.push(word);
								}
								newWord.tiles = placedLetters;
								isMatchFound = true;
							}
						}
						// if placed letters arent a component of a new word AND they can make a whole word
						// push them on to words array
						if (!horContacts.length) {
							if (isMatchFound) {
								words.push(newWord);
							} else {
								// otherwise perm is invalid and we break early
								isValidPerm = false;
								break;
							}
						}
					} else if (
						wordObj[perm.permutation.length].includes(
							perm.string
						) &&
						!horContacts.length
					)
						words.push({
							fullWord: perm.string,
							tiles: placedLetters,
							hasJoker: perm.jokers > 0, // should always be false
						});

					// loop through contacts to find newly created words
					// vertical contacts
					for (const c of verContacts) {
						const word = {
							fullWord: '',
							tiles: [],
							jokerIndices: [],
						};
						let yDelta = 0;
						while (
							c[0] + yDelta < BOARD_LENGTH &&
							workingState[c[0] + yDelta][c[1]]
						) {
							const letter = workingState[c[0] + yDelta][c[1]];
							const isLetterJoker = Array.isArray(letter);
							word.fullWord += isLetterJoker ? 'j' : letter;
							word.tiles.push({
								letter: letter,
								y: c[0] + yDelta,
								x: c[1],
								hasBonus: state[c[0] + yDelta][c[1]]
									? false
									: true,
								isJoker: isLetterJoker,
							});
							if (isLetterJoker) {
								word.hasJoker = true;
								word.jokerIndices.push(yDelta);
							}
							yDelta++;
						}
						if (word.hasJoker) {
							// if word has a joker push all potentialy valid combinations
							word.fullWord = [word.fullWord];
							for (const jokerIndex of word.jokerIndices) {
								for (const letter of word.tiles[jokerIndex]
									.letter) {
									word.fullWord.push(
										word.fullWord[0].slice(0, jokerIndex) +
											letter +
											word.fullWord[0].slice(
												jokerIndex + 1
											)
									);
								}
							}
							// remove first fullWord as it still has a lowercase 'j'
							word.fullWord.splice(0, 1);
							let isValidJoker = false;
							// find any invalid joker letters and store there indices so we can remove them
							const badJokerLetterIndices = [];
							for (let j = 0; j < word.fullWord.length; j++) {
								const w = word.fullWord[j];
								if (wordObj[w.length].includes(w)) {
									isValidJoker = true;
								} else {
									badJokerLetterIndices.push(j);
								}
							}
							// if no valid words found break early
							if (!isValidJoker) {
								isValidPerm = false;
								break;
							}
							// remove bad joker letters and fullWords
							for (const jokerIndex of word.jokerIndices) {
								for (
									let j = 0;
									j < badJokerLetterIndices.length;
									j++
								) {
									const badIndex = badJokerLetterIndices[j];
									word.fullWord.splice(badIndex - j, 1);
									word.tiles[jokerIndex].letter.splice(
										badIndex - j,
										1
									);
								}
							}
							// if all words removed break early
							if (!word.fullWord.length) {
								isValidPerm = false;
								break;
							}
							words.push(word);
						} else if (
							wordObj[word.fullWord.length].includes(
								word.fullWord
							)
						) {
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
							jokerIndices: [],
						};
						let xDelta = 0;
						while (
							c[1] + xDelta < BOARD_LENGTH &&
							workingState[c[0]][c[1] + xDelta]
						) {
							const letter = workingState[c[0]][c[1] + xDelta];
							const isLetterJoker = Array.isArray(letter);
							word.fullWord += isLetterJoker ? 'j' : letter;
							word.tiles.push({
								letter: letter,
								y: c[0],
								x: c[1] + xDelta,
								hasBonus: state[c[0]][c[1] + xDelta]
									? false
									: true,
								isJoker: isLetterJoker,
							});
							if (isLetterJoker) {
								word.hasJoker = true;
								word.jokerIndices.push(xDelta);
							}
							xDelta++;
						}

						if (word.hasJoker) {
							// if word has a joker push all potentialy valid combinations
							word.fullWord = [word.fullWord];
							for (const jokerIndex of word.jokerIndices) {
								for (const letter of word.tiles[jokerIndex]
									.letter) {
									word.fullWord.push(
										word.fullWord[0].slice(0, jokerIndex) +
											letter +
											word.fullWord[0].slice(
												jokerIndex + 1
											)
									);
								}
							}
							// remove first fullWord as it still has a lowercase 'j'
							word.fullWord.splice(0, 1);
							let isValidJoker = false;
							// find any invalid joker letters and store there indices so we can remove them
							const badJokerLetterIndices = [];
							for (let j = 0; j < word.fullWord.length; j++) {
								const w = word.fullWord[j];
								if (wordObj[w.length].includes(w)) {
									isValidJoker = true;
								} else {
									badJokerLetterIndices.push(j);
								}
							}
							// if no valid words found break early
							if (!isValidJoker) {
								isValidPerm = false;
								break;
							}
							// remove bad joker letters and fullWords
							for (const jokerIndex of word.jokerIndices) {
								for (
									let j = 0;
									j < badJokerLetterIndices.length;
									j++
								) {
									const badIndex = badJokerLetterIndices[j];
									word.fullWord.splice(badIndex - j, 1);
									word.tiles[jokerIndex].letter.splice(
										badIndex - j,
										1
									);
								}
							}
							// if all words removed break early
							if (!word.fullWord.length) {
								isValidPerm = false;
								break;
							}
							words.push(word);
						} else if (
							wordObj[word.fullWord.length].includes(
								word.fullWord
							)
						) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (isValidPerm && words.length) {
						const move = {
							placedLetters: placedLetters,
							words: words,
							score: getWordScore(words),
						};
						validWords.push(move);
					}
				}
			}
		}
	}
	console.timeEnd('Horizontal placements');

	console.time('Vertical placements');
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
					// array of placed letters that contact anchors left or right
					const horContacts = [];
					// placed letter coordinates for score calculation
					const placedLetters = [];
					// place letters in workingState
					for (let j = perm.permutation.length - 1; j >= 0; j--) {
						if (workingState[yStart - j][n[1]]) {
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
						if (workingState[yStart - j][n[1] - 1]) {
							// if there is contact left search for the furthest left letter
							let xDelta = 1;
							while (workingState[yStart - j][n[1] - xDelta]) {
								xDelta++;
							}
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
					let isMatchFound = false;
					// make sure perm is on array if it is valid and isn't a component of another word
					if (perm.jokers) {
						const jokerRegExp = new RegExp(perm.string);
						const newWord = {
							fullWord: [],
							hasJoker: true,
						};
						// search wordArray for valid joker letters
						for (const word of wordObj[perm.permutation.length]) {
							if (
								word.length === perm.permutation.length &&
								jokerRegExp.test(word)
							) {
								// push valid joker letters to the placed letter or each joker
								for (const jokerIndex of perm.jokerIndices) {
									placedLetters[jokerIndex].letter.push(
										word[jokerIndex]
									);
									newWord.fullWord.push(word);
								}
								newWord.tiles = placedLetters;
								isMatchFound = true;
							}
						}
						// if placed letters arent a component of a new word AND they can make a whole word
						// push them on to words array
						if (!verContacts.length) {
							if (isMatchFound) {
								words.push(newWord);
							} else {
								// otherwise perm is invalid and we break early
								isValidPerm = false;
								break;
							}
						}
					} else if (
						wordObj[perm.permutation.length].includes(
							perm.string
						) &&
						!verContacts.length
					)
						words.push({
							fullWord: perm.string,
							tiles: placedLetters,
							hasJoker: perm.jokers > 0, // should always be false
						});

					// loop through contacts to find newly created words
					// VERTICAL CONTACTS
					for (const c of verContacts) {
						const word = {
							fullWord: '',
							tiles: [],
							jokerIndices: [],
						};
						let yDelta = 0;
						while (
							c[0] + yDelta < BOARD_LENGTH &&
							workingState[c[0] + yDelta][c[1]]
						) {
							const letter = workingState[c[0] + yDelta][c[1]];
							const isLetterJoker = Array.isArray(letter);
							word.fullWord += isLetterJoker ? 'j' : letter;
							word.tiles.push({
								letter: letter,
								y: c[0] + yDelta,
								x: c[1],
								hasBonus: state[c[0] + yDelta][c[1]]
									? false
									: true,
								isJoker: isLetterJoker,
							});
							if (isLetterJoker) {
								word.hasJoker = true;
								word.jokerIndices.push(yDelta);
							}
							yDelta++;
						}
						if (word.hasJoker) {
							// if word has a joker push all potentialy valid combinations
							word.fullWord = [word.fullWord];
							for (const jokerIndex of word.jokerIndices) {
								for (const letter of word.tiles[jokerIndex]
									.letter) {
									word.fullWord.push(
										word.fullWord[0].slice(0, jokerIndex) +
											letter +
											word.fullWord[0].slice(
												jokerIndex + 1
											)
									);
								}
							}
							// remove first fullWord as it still has a lowercase 'j'
							word.fullWord.splice(0, 1);
							let isValidJoker = false;
							// find any invalid joker letters and store there indices so we can remove them
							const badJokerLetterIndices = [];
							for (let j = 0; j < word.fullWord.length; j++) {
								const w = word.fullWord[j];
								if (wordObj[w.length].includes(w)) {
									isValidJoker = true;
								} else {
									badJokerLetterIndices.push(j);
								}
							}
							// if no valid words found break early
							if (!isValidJoker) {
								isValidPerm = false;
								break;
							}
							// remove bad joker letters and fullWords
							for (const jokerIndex of word.jokerIndices) {
								for (
									let j = 0;
									j < badJokerLetterIndices.length;
									j++
								) {
									const badIndex = badJokerLetterIndices[j];
									word.fullWord.splice(badIndex - j, 1);
									word.tiles[jokerIndex].letter.splice(
										badIndex - j,
										1
									);
								}
							}
							// if all words removed break early
							if (!word.fullWord.length) {
								isValidPerm = false;
								break;
							}
							words.push(word);
						} else if (
							wordObj[word.fullWord.length].includes(
								word.fullWord
							)
						) {
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
							jokerIndices: [],
						};
						let xDelta = 0;
						while (
							c[1] + xDelta < BOARD_LENGTH &&
							workingState[c[0]][c[1] + xDelta]
						) {
							const letter = workingState[c[0]][c[1] + xDelta];
							const isLetterJoker = Array.isArray(letter);
							word.fullWord += isLetterJoker ? 'j' : letter;
							word.tiles.push({
								letter: letter,
								y: c[0],
								x: c[1] + xDelta,
								hasBonus: state[c[0]][c[1] + xDelta]
									? false
									: true,
								isJoker: isLetterJoker,
							});
							if (isLetterJoker) {
								word.hasJoker = true;
								word.jokerIndices.push(xDelta);
							}
							xDelta++;
						}
						if (word.hasJoker) {
							// if word has a joker push all potentialy valid combinations
							word.fullWord = [word.fullWord];
							for (const jokerIndex of word.jokerIndices) {
								for (const letter of word.tiles[jokerIndex]
									.letter) {
									word.fullWord.push(
										word.fullWord[0].slice(0, jokerIndex) +
											letter +
											word.fullWord[0].slice(
												jokerIndex + 1
											)
									);
								}
							}
							// remove first fullWord as it still has a lowercase 'j'
							word.fullWord.splice(0, 1);
							let isValidJoker = false;
							// find any invalid joker letters and store there indices so we can remove them
							const badJokerLetterIndices = [];
							for (let j = 0; j < word.fullWord.length; j++) {
								const w = word.fullWord[j];
								if (wordObj[w.length].includes(w)) {
									isValidJoker = true;
								} else {
									badJokerLetterIndices.push(j);
								}
							}
							// if no valid words found break early
							if (!isValidJoker) {
								isValidPerm = false;
								break;
							}
							// remove bad joker letters and fullWords
							for (const jokerIndex of word.jokerIndices) {
								for (
									let j = 0;
									j < badJokerLetterIndices.length;
									j++
								) {
									const badIndex = badJokerLetterIndices[j];
									word.fullWord.splice(badIndex - j, 1);
									word.tiles[jokerIndex].letter.splice(
										badIndex - j,
										1
									);
								}
							}
							// if all words removed break early
							if (!word.fullWord.length) {
								isValidPerm = false;
								break;
							}
							words.push(word);
						} else if (
							wordObj[word.fullWord.length].includes(
								word.fullWord
							)
						) {
							words.push(word);
						} else {
							isValidPerm = false;
							break;
						}
					}

					if (isValidPerm && words.length) {
						const move = {
							placedLetters: placedLetters,
							words: words,
							score: getWordScore(words),
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
	while (index < validWords.length && filteredValidWords.length < 50) {
		const validWord = validWords[index];
		const move = JSON.stringify(validWord);
		if (!usedMoves.has(move)) {
			filteredValidWords.push(validWord);
			usedMoves.add(move);
		}
		index++;
	}
	console.timeEnd('Sort and filter');

	return [filteredValidWords, validWords.length];
};

const hand = ['A', 'B', 'N', 'P', 'S', 'E', 'T'];
console.log('hand:', hand);
console.time('Total runtime');
const validWords = getValidWords(hand, testState);
console.timeEnd('Total runtime');
console.log(validWords);
for (const validWord of validWords) {
	console.log(JSON.stringify(validWord, null, '\t'));
}

fs.writeFileSync(
	`./algorithm/data/cache/cachedResults.json`,
	JSON.stringify({ validWords }),
	'utf8'
);
