class TrieNode {
	constructor() {
		this.children = {}; // stores child nodes
		this.isEndOfWord = false; // indicates if this is a valid end of word
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode();
	}

	// insert a word into the trie
	insert(word) {
		let current = this.root;
		for (const char of word) {
			// if this char doesnt exist at this layer add it
			if (!current.children[char]) {
				current.children[char] = new TrieNode();
			}
			current = current.children[char]; // move pointer one layer deeper
		}
		// after all chars are entered mark as valid end of word
		current.isEndOfWord = true;
	}

	// search for a word in trie
	search(word) {
		let current = this.root;
		for (const char of word) {
			// if can't find char at this layer return false
			if (!current.children[char]) {
				return false;
			}
			current = current.children[char]; // move pointer one layer deeper
		}
		// after all chars are entered check wether is valid end of word
		return current.isEndOfWord;
	}

	specialSearch(word, ptr) {
		let current = ptr || this.root;
		const jokerValues = [];
		let jokerCount = 0;
		let remaining = word;
		for (const char of word) {
			if (char !== 'j') {
				if (!current.children[char]) {
					return [false, []];
				}
				remaining = remaining.slice(1);
				current = current.children[char];
			} else {
				jokerCount++;
				const letters = Object.keys(current.children);
				if (!letters.length) {
					return [false, []];
				}
				jokerValues.push([]);
				remaining = remaining.slice(1);

				for (let i = 0; i < letters.length; i++) {
					const l = letters[i];
					let [isValidLetter] = this.specialSearch(
						remaining,
						current.children[l]
					);
					if (isValidLetter) {
						jokerValues[jokerCount - 1].push(l);
					}
				}
				if (jokerValues[0].length) {
					current = current.children[jokerValues[jokerCount - 1][0]];
				} else {
					return [false, []];
				}
			}
		}
		return [current.isEndOfWord, jokerValues];
	}

	// search for a word with a given prefix
	startsWith(prefix) {
		let current = this.root;
		for (const char of prefix) {
			// if can't find char at this layer return false
			if (!current.children[char]) {
				return false;
			}
			current = current.children[char]; // move pointer one layer deeper
		}
		// if all leters have been entered words exist with the prefix
		return true;
	}
}

export default Trie;
