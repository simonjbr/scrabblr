import pixelToPercent from './pixelToPercent.js';
import sortAndFilterDetects from './sortAndFilterDetects.js';
import getHand from './getHand.js';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]} detections OCR detections
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number}} dimensions dimensions of the screenshot
 * @returns {{hand: string[], boxSize: number, dimensions: {height: number, width: number}, gridDetections: {description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}}}
 */

const parseDetects = (detections, dimensions, fullTextAnnotations, detailedWords) => {
	// indices for top left and bottom right squares of game grid
	let topLeftIndex = 0;
	let bottomRightIndex = 0;

	const handDetects = [];

	// loop to identify above variables
	for (let i = 1; i < detections.length; i++) {
		const d = detections[i];

		d.isGameGrid = false;
		d.isHand = false;

		// cloud vision can confuse a T with a hebrew character
		if (d.description.includes('יז'))
			d.description = d.description.replace(/יז/g, 'T');
		// replace 0's with O's
		if (d.description.includes('0')) {
			if (d.description !== '10')
				d.description = d.description.replace(/0/g, 'O');
		}
		// remove any non [A-Z] characters
		d.description = d.description.replace(/[^A-Z]/g, '');

		// vertices aren't always in the same order so i correct by using max mins of each axis
		// maximum and minimum coordinates of text detections
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

		// add a center vertex to account for varying detection dimensions
		const centerVertex = {};
		centerVertex.x = d.coords.minX + (d.coords.maxX - d.coords.minX) / 2;
		centerVertex.y = d.coords.minY + (d.coords.maxY - d.coords.minY) / 2;
		d.center = centerVertex;

		// dimensions of the detection
		d.dim = { pixel: {} };

		d.dim.pixel.x = d.coords.maxX - d.coords.minX;
		d.dim.pixel.y = d.coords.maxY - d.coords.minY;

		if (
			d.coords.minY > dimensions.gridStart &&
			d.coords.maxY < dimensions.gridEnd &&
			/^[A-Z]+$/.test(d.description)
		) {
			d.isGameGrid = true;
			if (!topLeftIndex) {
				topLeftIndex = i;
			}
			bottomRightIndex = i;
		}

		if (
			d.coords.minY >= dimensions.gridEnd &&
			d.coords.minY <= dimensions.gridEnd + dimensions.handDim
		) {
			d.isHand = true;
			handDetects.push(d);
		}
	}

	const topLeft = detections[topLeftIndex];
	const bottomRight = detections[bottomRightIndex];

	const hand = getHand(handDetects, dimensions);
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
	// const boxSize = (bottomRight.center.y - topLeft.center.y) / 14;
	const boxSize = dimensions.width / 15;
	console.log('boxSize:', boxSize);

	// filter out all non game grid detections
	// and sort left to right and top to bottom
	const sortedAndFiltered = sortAndFilterDetects(
		detections,
		dimensions,
		boxSize,
		fullTextAnnotations
	);

	return {
		hand: hand,
		boxSize: boxSize,
		dimensions: dimensions,
		gridDetections: sortedAndFiltered,
	};
};

export default parseDetects;
