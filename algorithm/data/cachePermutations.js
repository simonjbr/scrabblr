import fs from 'node:fs';
import getPermutaions from './permutations.js';

const hand = ['A', 'B', 'N', 'j', 'S', 'E', 'T'];

const perms = getPermutaions(hand);
console.log(perms.length);

fs.writeFileSync(
	`./algorithm/data/cache/testPermutations.json`,
	JSON.stringify({ perms }),
	'utf8'
);
