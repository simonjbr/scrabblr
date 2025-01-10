import fs from 'node:fs';
import sizeOf from 'image-size';
import getOCR from './util/getOCR.js';
import getDetectsFromCache from './util/getDetectsFromCache.js';
import parseDetects from './util/parseDetects.js';
import createBoardState from './util/createBoardState.js';
import getValidWords from '../algorithm/permAlgorithm.js';

const main = async () => {
	// get height and width of screenshot
	const dimensions = sizeOf('./OCR/assets/04.jpg');
	// console.log(dimensions);

	const detections = getDetectsFromCache() || getOCR('./OCR/assets/04.jpg');
	// const detections = await getOCR('./OCR/assets/05.jpg');

	const parsedDetects = parseDetects(detections, dimensions);

	const boardState = createBoardState(parsedDetects);

	console.log(boardState);

	let count = 0;
	boardState.forEach((row, index) => {
		console.log(index, '=', row.length);
		count += row.length;
	});

	console.log('count:', count, 'should be:', 15 * 15);

	// const hand = ['S', 'L', 'O', 'T', 'A', 'O', 'R'];
	const validWords = getValidWords(parsedDetects.hand, boardState);

	console.log(validWords);

	fs.writeFileSync(
		`./algorithm/data/cache/cachedResults.json`,
		JSON.stringify({ validWords }),
		'utf8'
	);
};

main();
