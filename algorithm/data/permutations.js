const getPermutations = (hand) => {
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
					string: p.join(''),
					jokers: jokers,
					jokerIndices: jokerIndices,
				});
			}
		}

		return permutations;
	};

	generateSubsets([], 0);

	console.log('permutations length:', results.length);
	return results;
};

// const hand = ['A', 'B', 'N', 'j', 'S', 'E', 'T'];
// getPermutations(hand);

export default getPermutations;
