import fs from 'node:fs';
import getOCR from './util/getOCR.js';
import getDocumentOCR from './util/getDocumentOCR.js';
import getDetectsFromCache from './util/getDetectsFromCache.js';
import parseDetects from './util/parseDetects.js';
import createBoardState from './util/createBoardState.js';
import getValidWords from '../algorithm/permAlgorithm.js';
import getDimensions from './util/getDimensions.js';

const main = async () => {
	// const {
	// 	detailedWords,
	// 	dimensions: { width, height },
	// } = getDetectsFromCache() || getDocumentOCR('./OCR/assets/08_1080.jpg');
	// const { detailedWords, dimensions } = await getOCR(
	// 	'./OCR/assets/08_1080.jpg'
	// );
	const {
		dimensions: { width, height },
		detailedWords,
	} = await getDocumentOCR('./OCR/assets/09_1080.jpg');

	const dimensions = getDimensions(width, height);

	console.log(dimensions);

	const parsedDetects = parseDetects(dimensions, detailedWords);

	const boardState = createBoardState(parsedDetects);

	console.log(boardState);

	let count = 0;
	boardState.forEach((row, index) => {
		console.log(index, '=', row.length);
		count += row.length;
	});

	console.log('count:', count, 'should be:', 15 * 15);

	const validWords = getValidWords(parsedDetects.hand, boardState);

	console.log(validWords);

	fs.writeFileSync(
		`./algorithm/data/cache/cachedResults.json`,
		JSON.stringify({ validWords }),
		'utf8'
	);
};

main();
