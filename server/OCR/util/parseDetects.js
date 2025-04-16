import pixelToPercent from './pixelToPercent.js';
import sortAndFilterDetects from './sortAndFilterDetects.js';
import getHand from './getHand.js';
import getMinMaxVertices from './getMinMaxVertices.js';
import getCenterVertex from './getCenterVertex.js';
import getDetectionDimensions from './getDetectionDimensions.js';
import bonusTileValues from './bonusTileValues.js';

/**
 *
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}} dimensions dimensions of the screenshot
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} symbols OCR detections
 * @returns {{hand: string[], dimensions: {height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}, gridDetections: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]}}
 */

const parseDetects = (dimensions, symbols) => {
	// indices for top left and bottom right squares of game grid
	let topLeftIndex = 0;
	let bottomRightIndex = 0;

	const handDetects = [];

	// loop to identify above variables
	for (let i = 1; i < symbols.length; i++) {
		const s = symbols[i];

		// cloud vision can confuse some letters with a hebrew characters
		if (s.text === 'Ι') s.text = 'I'; // this is a the Greek letter Iota!?
		if (s.text === 'ש') s.text = 'E';
		if (s.text === 'כ') s.text = 'U';
		if (s.text === 'ז') s.text = 'T';
		if (s.text === 'י') s.ignore = true;

		if (
			s.coords.minY >= dimensions.gridEnd &&
			s.coords.minY <= dimensions.gridEnd + dimensions.handDim
		) {
			s.isHand = true;
			handDetects.push(s);
			continue;
		}

		// check if this detect + the next detect form a bonus square
		// minX of the second letter of a bonus square is > 0.38
		const nextS = symbols[i + 1];
		if (
			i < symbols.length - 1 &&
			bonusTileValues.has(s.text + nextS.text) &&
			nextS.minXPositionWithinBox > 0.37
		) {
			s.text += nextS.text;
			s.isBonus = true;
			nextS.ignore = true;
		}

		// filter out tile scores and low confidence symbols
		// if the detection begins < 0.3 * boxSize from the left it is a letter
		// anymore then it is likely part of a tile's score
		if (s.minXPositionWithinBox > dimensions.minXPositionMultiplier) {
			s.ignore = true;
		}

		// having ruled out tile scores we can replace 0's with O's
		if (s.text === '0' && !s.ignore) s.text = 'O';

		// ignore any non [A-Z] symbols
		if (s.text.match(/[^A-Z]/)) s.ignore = true;

		if (
			s.coords.minY > dimensions.gridStart &&
			s.coords.maxY < dimensions.gridEnd &&
			/^[A-Z]+$/.test(s.text)
		) {
			s.isGameGrid = true;
			if (!topLeftIndex) {
				topLeftIndex = i;
			}
			bottomRightIndex = i;
		}
	}

	const topLeft = symbols[topLeftIndex];
	const bottomRight = symbols[bottomRightIndex];

	const hand = getHand(handDetects, dimensions);
	console.log('hand:', hand);

	console.log(
		'topLeft:',
		topLeftIndex,
		symbols[topLeftIndex].boundingBox.vertices
	);
	console.log(
		'bottomRigth:',
		bottomRightIndex,
		symbols[bottomRightIndex].boundingBox.vertices
	);

	// filter out all non game grid detections
	// and sort left to right and top to bottom
	const sortedAndFiltered = sortAndFilterDetects(dimensions, symbols);

	return {
		hand: hand,
		boxSize: dimensions.boxSize,
		dimensions: dimensions,
		gridDetections: sortedAndFiltered,
	};
};

export default parseDetects;
