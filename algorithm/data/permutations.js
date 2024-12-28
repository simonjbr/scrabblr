import { wordsString } from './words.js';

const getPermutations = (hand, anchors) => {
	const results = [];

	// create anchor regExp character set
	let anchorCharGroup = '(';
	for (let i = 0; i < anchors.length; i++) {
		const a = anchors[i];
		anchorCharGroup += a[0];
		if (i !== anchors.length - 1) anchorCharGroup += '|';
	}
	anchorCharGroup += ')?';

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
		if (arr.length === 1) {
			const isJoker = arr[0] === 'j';
			return [
				{
					permutation: arr,
					jokers: isJoker ? 1 : 0,
					jokerIndices: isJoker ? [0] : [],
					string: arr[0],
				},
			];
		}

		const permutations = [];
		for (let i = 0; i < arr.length; i++) {
			const current = arr[i];
			// slice out current letter
			const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
			for (const perm of permute(remaining)) {
				const p = [current, ...perm.permutation];

				// how many jokers are in this permutation
				let jokers = 0;
				const jokerIndices = [];

				for (let k = 0; k < p.length; k++) {
					const letter = p[k];
					if (letter === 'j') {
						jokerIndices.push(k);
						jokers++;
					}
				}

				// add all perms to permutations
				permutations.push({
					permutation: p,
					// string: p.join('').replace(/j/g, '[A-Z]'),
					jokers: jokers,
					jokerIndices: jokerIndices,
				});
			}
		}

		// return permutations;

		// filter out perms that don't exist as components of words
		const filteredPermutations = [];
		for (const p of permutations) {
			p.string = p.permutation.join('');
			if (p.jokers === 0) {
				let regExpString = '';
				for (const char of p.string) {
					regExpString += char;
					regExpString += anchorCharGroup;
				}
				p.regExp = new RegExp(regExpString);
				if (p.regExp.test(wordsString)) {
					filteredPermutations.push(p);
				}
			} else {
				// if there are jokers in permutation
				// dynamically generate regex to test with
				p.string = '';
				for (const letter of p.permutation) {
					if (letter !== 'j') {
						p.string += letter;
					} else {
						p.string += '[A-Z]';
					}
				}
				// store regex in permutation object
				p.regExp = new RegExp(p.string);
				if (p.regExp.test(wordsString)) {
					filteredPermutations.push(p);
				}
			}
		}
		return filteredPermutations;
	};

	generateSubsets([], 0);

	console.log('permutations length:', results.length);
	return results;
};

// const hand = ['A', 'B', 'N', 'j', 'S', 'E', 'T'];
// getPermutations(hand);

export default getPermutations;
