import fs from 'node:fs';
import wordListPath from 'word-list';

// generates an array of english words
const wordArray = fs
	.readFileSync(wordListPath, 'utf8')
	.toUpperCase()
	.split('\n')
	.sort((a, b) => a.length -b.length);

export default wordArray;
