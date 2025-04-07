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
			const foundWord = word.fullWord;
			word.fullWord = [];
			const [isMatchFound, jokerValues] = trie.specialSearch(foundWord);
			if (isMatchFound) {
				const tempWords = [];
				for (let i = 0; i < jokerValues.length; i++) {
					const jokerValue = jokerValues[i];
					const jokerIndex = word.jokerIndices[i];
					word.tiles[jokerIndex].letter.push(...jokerValue);
					for (const jLetter of jokerValue) {
						if (word.jokerIndices.length === 1) {
							word.fullWord.push(foundWord.replace(/j/, jLetter));
						} else if (i === 0) {
							tempWords.push(foundWord.replace(/j/, jLetter));
						} else {
							for (let tempWord of tempWords) {
								word.fullWord.push(
									tempWord.replace(/j/, jLetter)
								);
							}
						}
					}
				}
				words.push(word);
			} else {
				return false;
			}
		} else if (trie.search(word.fullWord)) {
			words.push(word);
		} else {
			return false;
		}
	}
	return true;
};

export default findNewWords;
