import fs from 'node:fs';
import sizeOf from 'image-size';
import getOCR from './util/getOCR.js';
import getDocumentOCR from './util/getDocumentOCR.js';
import getDetectsFromCache from './util/getDetectsFromCache.js';
import parseDetects from './util/parseDetects.js';
import createBoardState from './util/createBoardState.js';
import getValidWords from '../algorithm/permAlgorithm.js';

const main = async () => {
	// get height and width of screenshot
	const dimensions = sizeOf('./OCR/assets/iphone.jpg');
	// proportion of height dimension for start and end of game grid
	const GRID_START_MULTIPLIER = 0.14;
	const GRID_END_MULTIPLIER = 0.8;

	// pixel values for start and end of game grid
	dimensions.gridStart = GRID_START_MULTIPLIER * dimensions.height;
	dimensions.gridEnd = GRID_END_MULTIPLIER * dimensions.height;

	// proportion of width for hand tiles
	const HAND_MULTIPLIER = 1 / 7;
	// pixel value for hand tile dimensions
	dimensions.handDim = HAND_MULTIPLIER * dimensions.width;
	// sort fuzziness as proportion of height
	const FUZZINESS_MULTIPLIER = 0.01;
	dimensions.fuzziness = FUZZINESS_MULTIPLIER * dimensions.height;

	// const detections =
	// getDetectsFromCache() || getDocumentOCR('./OCR/assets/08_1080.jpg');
	// const detections = await getOCR('./OCR/assets/08_1080.jpg');
	const detections = await getDocumentOCR('./OCR/assets/iphone.jpg');

	const parsedDetects = parseDetects(detections, dimensions);

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
