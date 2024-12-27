import fs from 'node:fs';

const getPermsFromCache = () => {
	try {
		const perms = JSON.parse(
			fs.readFileSync(
				'./algorithm/data/cache/testPermutations.json',
				// './algorithm/data/cache/quickTest.json',
				'utf8'
			)
		);

		return perms;
	} catch (error) {
		console.log(error.message);
		return false;
	}
};
// const perms = getPermsFromCache();

// for (const p of perms) {
// 	if (p.jokers) console.log(p.regExp);
// }

export default getPermsFromCache;
