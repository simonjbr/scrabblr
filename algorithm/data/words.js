import fs from 'node:fs';
import wordListPath from 'word-list';

// generates an array of english words
const wordArray = fs
	.readFileSync(wordListPath, 'utf8')
	.toUpperCase()
	.split('\n')
	.sort((a, b) => a.length - b.length);

const wordObj = {};
for (const word of wordArray) {
	if (!wordObj[word.length]) {
		wordObj[word.length] = [];
	}
	wordObj[word.length].push(word);
}

const wordArraySplit = [[]];
for (const word of wordArray) {
	if (!wordArraySplit[word.length]) {
		wordArraySplit.push([]);
		if (word.length === 27) {
			wordArraySplit.push([]);
		}
	}

	wordArraySplit[word.length].push(word);
}

// fs.writeFileSync(
// 	`./algorithm/data/words.json`,
// 	JSON.stringify({ wordObj }),
// 	'utf8'
// );

export { wordArray, wordObj, wordArraySplit };
