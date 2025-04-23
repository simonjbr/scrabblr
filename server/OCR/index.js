// import fs from 'node:fs';
// import getOCR from './util/getOCR.js';
import getDocumentOCR from './util/getDocumentOCR.js';
// import getDetectsFromCache from './util/getDetectsFromCache.js';
import parseDetects from './util/parseDetects.js';
import createBoardState from './util/createBoardState.js';
import getValidWords from '../algorithm/permAlgorithm.js';

const main = async () => {
	// const {
	// 	detailedWords,
	// 	dimensions: { width, height },
	// } = getDetectsFromCache() || getDocumentOCR('./OCR/assets/08_1080.jpg');
	// const { detailedWords, dimensions } = await getOCR(
	// 	'./OCR/assets/08_1080.jpg'
	// );
	const { dimensions, symbols } = await getDocumentOCR(
		'./server/OCR/assets/WWF/12.jpg',
		'wwf'
	);

	console.log(dimensions);

	const parsedDetects = parseDetects(dimensions, symbols);

	const boardState = createBoardState(parsedDetects);

	console.log(boardState);
	console.log(boardState.length);

	let count = 0;
	boardState.forEach((row, index) => {
		console.log(index, '=', row.length);
		count += row.length;
	});

	console.log('count:', count, 'should be:', 15 * 15);

	const validWords = getValidWords(parsedDetects.hand, boardState);

	console.log(validWords);

	// fs.writeFileSync(
	// 	`./server/algorithm/data/cache/cachedResults.json`,
	// 	JSON.stringify({ validWords }),
	// 	'utf8'
	// );
};

main();
