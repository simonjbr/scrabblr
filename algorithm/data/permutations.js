import wordArray from './words.js';

const getPermutaions = (hand) => {
	console.log('permutations:');
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
		// if (arr.length === 1) return [arr];
		if (arr.length === 1) {
			const isJoker = arr[0] === 'j';
			return [
				{
					permutation: arr,
					jokers: isJoker ? 1 : 0,
					jokerIndices: isJoker ? [0] : [],
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
					jokers: jokers,
					jokerIndices: jokerIndices,
				});
			}
		}

		// filter out perms that don't exist as components of words
		const filteredPermutations = [];
		for (const p of permutations) {
			const pString = p.permutation.join('');
			if (p.jokers === 0) {
				p.regExp = new RegExp(pString);
				for (const word of wordArray) {
					if (word.includes(pString)) {
						filteredPermutations.push(p);
						break;
					}
				}
			} else {
				// if there are jokers in permutation
				// dynamically generate regex to test with
				let jokerRegExpString = '';
				for (const letter of p.permutation) {
					if (letter !== 'j') {
						jokerRegExpString += letter;
					} else {
						jokerRegExpString += '[A-Z]';
					}
				}
				// store regex in permutation object
				// const jokerRegExp = new RegExp(jokerRegExpString);
				p.regExp = new RegExp(jokerRegExpString);
				for (const word of wordArray) {
					if (p.regExp.test(word)) {
						filteredPermutations.push(p);
						console.log(p.permutation);
						break;
					}
				}
			}
		}
		return filteredPermutations;
	};

	generateSubsets([], 0);
	console.log('permutations length:', results.length);
	return results;
};

export default getPermutaions;
