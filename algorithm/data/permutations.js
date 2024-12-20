import { wordObj } from './words.js';

const getPermutations = (hand) => {
	// console.log('permutations:');
	const results = [];
	const MAX_LENGTH = 28;

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
					jokers: jokers,
					jokerIndices: jokerIndices,
				});
			}
		}

		// filter out perms that don't exist as components of words
		const filteredPermutations = [];
		for (const p of permutations) {
			p.string = p.permutation.join('');
			if (p.jokers === 0) {
				p.regExp = new RegExp(p.string);
				for (
					let length = p.permutation.length;
					length <= MAX_LENGTH;
					length++
				) {
					let isValidPerm = false;
					if (length === 26) continue;
					const wordArray = wordObj[length];
					for (const word of wordArray) {
						if (word.includes(p.string)) {
							filteredPermutations.push(p);
							// console.log(p.permutation);
							isValidPerm = true;
							break;
						}
					}
					if (isValidPerm) break;
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
				for (
					let length = p.permutation.length;
					length <= MAX_LENGTH;
					length++
				) {
					let isValidPerm = false;
					if (length === 26) continue;
					const wordArray = wordObj[length];
					for (const word of wordArray) {
						if (p.regExp.test(word)) {
							filteredPermutations.push(p);
							// console.log(p.permutation);
							isValidPerm = true;
							break;
						}
					}
					if (isValidPerm) break;
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
