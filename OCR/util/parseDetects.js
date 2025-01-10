import pixelToPercent from './pixelToPercent.js';
import sortAndFilterDetects from './sortAndFilterDetects.js';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]} detections OCR detections
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @returns {{hand: string[], boxSize: number, dimensions: {height: number, width: number}, gridDetections: {description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}}}
 */

const parseDetects = (detections, dimensions) => {
	// indices for top left and bottom right squares of game grid
	let topLeftIndex = 0;
	let bottomRightIndex = 0;

	let handDetects = '';

	// loop to identify above variables
	for (let i = 1; i < detections.length; i++) {
		const d = detections[i];

		d.isGameGrid = false;
		d.isHand = false;

		// cloud vision can confuse a T with a hebrew character
		if (d.description.includes('יז'))
			d.description = d.description.replace(/יז/g, 'T');
		// remove any non [A-Z] characters
		d.description = d.description.replace(/[^A-Z]/g, '');

		// vertices aren't always in the same order so i correct by using max mins of each axis
		// maximum and minimum coordinates of text detections in game grid
		d.coords = {};

		d.coords.minX = d.boundingPoly.vertices[0].x;
		d.coords.minY = d.boundingPoly.vertices[0].y;
		d.coords.maxX = 0;
		d.coords.maxY = 0;

		for (const vertex of d.boundingPoly.vertices) {
			d.coords.minX = Math.min(vertex.x, d.coords.minX);
			d.coords.minY = Math.min(vertex.y, d.coords.minY);
			d.coords.maxX = Math.max(vertex.x, d.coords.maxX);
			d.coords.maxY = Math.max(vertex.y, d.coords.maxY);
		}

		// dimensions of the detection
		d.dim = { pixel: {} };

		d.dim.pixel.x = d.coords.maxX - d.coords.minX;
		d.dim.pixel.y = d.coords.maxY - d.coords.minY;

		if (
			d.coords.minY > 300 &&
			dimensions.height - d.coords.maxY > 430 &&
			/^[A-Z]+$/.test(d.description)
		) {
			d.isGameGrid = true;
			if (!topLeftIndex) {
				topLeftIndex = i;
			}
			bottomRightIndex = i;
		}

		if (
			dimensions.height - d.coords.minY <= 430 &&
			dimensions.height - d.coords.maxY >= 270
		) {
			d.isHand = true;
			handDetects += d.description;
		}
	}

	const topLeft = detections[topLeftIndex];
	const bottomRight = detections[bottomRightIndex];

	const hand = handDetects.split('').filter((char) => /^[A-Z]$/.test(char));
	console.log('hand:', hand);

	console.log(
		'topLeft:',
		topLeftIndex,
		detections[topLeftIndex].boundingPoly.vertices
	);
	console.log(
		'bottomRigth:',
		bottomRightIndex,
		detections[bottomRightIndex].boundingPoly.vertices
	);

	// size of each grid square
	const boxSize = (bottomRight.coords.minY - topLeft.coords.minY) / 14;
	console.log('boxSize:', boxSize);

	// filter out all non game grid detections
	// and sort left to right and top to bottom
	const sortedAndFiltered = sortAndFilterDetects(
		detections,
		dimensions,
		boxSize
	);

	return {
		hand: hand,
		boxSize: boxSize,
		dimensions: dimensions,
		gridDetections: sortedAndFiltered,
	};
};

export default parseDetects;
