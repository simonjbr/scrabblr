/**
 *
 * @param {String[][]} state
 * @param {String[][]} workingState
 * @param {number[][]} contacts
 * @param {Object} trie
 * @param {String} orientation orientation of tiles ('vertical' | 'horizontal')
 * @param {Object[]} words
 */

const findNewWords = (
	state,
	workingState,
	contacts,
	trie,
	orientation,
	words
) => {
	const BOARD_LENGTH = 15;

	// turn deltas on or off depending on orientation
	let xDeltaswitch = 0;
	let yDeltaswitch = 0;

	switch (orientation) {
		case 'vertical':
			yDeltaswitch = 1;
			break;
		case 'horizontal':
			xDeltaswitch = 1;
			break;
		default:
			break;
	}

	for (const c of contacts) {
		const word = {
			fullWord: '',
			tiles: [],
			jokerIndices: [],
		};
		let yDelta = 0;
		let xDelta = 0;

		while (
			c[0] + yDelta * yDeltaswitch < BOARD_LENGTH &&
			c[1] + xDelta * xDeltaswitch < BOARD_LENGTH &&
			workingState[c[0] + yDelta * yDeltaswitch][
				c[1] + xDelta * xDeltaswitch
			]
		) {
			const letter =
				workingState[c[0] + yDelta * yDeltaswitch][
					c[1] + xDelta * xDeltaswitch
				];
			const isLetterJoker = Array.isArray(letter);
			word.fullWord += isLetterJoker ? 'j' : letter;
			word.tiles.push({
				letter: letter,
				y: c[0] + yDelta * yDeltaswitch,
				x: c[1] + xDelta * xDeltaswitch,
				hasBonus: state[c[0] + yDelta * yDeltaswitch][
					c[1] + xDelta * xDeltaswitch
				]
					? false
					: true,
				isJoker: isLetterJoker,
			});
			if (isLetterJoker) {
				word.hasJoker = true;
				word.jokerIndices.push(yDeltaswitch ? yDelta : xDelta);
			}
			yDelta++;
			xDelta++;
		}
		if (word.hasJoker) {
			// if word has a joker push all potentialy valid combinations
			word.fullWord = [word.fullWord];
			for (const jokerIndex of word.jokerIndices) {
				for (const letter of word.tiles[jokerIndex].letter) {
					word.fullWord.push(
						word.fullWord[0].slice(0, jokerIndex) +
							letter +
							word.fullWord[0].slice(jokerIndex + 1)
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
				if (trie.search(w)) {
					isValidJoker = true;
				} else {
					badJokerLetterIndices.push(j);
				}
			}
			// if no valid words found break early
			if (!isValidJoker) {
				return false;
			}
			// remove bad joker letters and fullWords
			for (const jokerIndex of word.jokerIndices) {
				for (let j = 0; j < badJokerLetterIndices.length; j++) {
					const badIndex = badJokerLetterIndices[j];
					word.fullWord.splice(badIndex - j, 1);
					word.tiles[jokerIndex].letter.splice(badIndex - j, 1);
				}
			}
			// if all words removed break early
			if (!word.fullWord.length) {
				return false;
			}
			words.push(word);
		} else if (trie.search(word.fullWord)) {
			words.push(word);
		} else {
			return false;
		}
	}
	return true;
};

export default findNewWords;
