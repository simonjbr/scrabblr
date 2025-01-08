import pixelToPercent from './pixelToPercent.js';
import sortAndFilterDetects from './sortAndFilterDetects.js';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]} detections OCR detections
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @returns {{boxSize: number, dimensions: {height: number, width: number}, gridDetections: {description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}}}
 */

const parseDetects = (detections, dimensions) => {
	// indices for top left and bottom right squares of game grid
	let topLeftIndex = 0;
	let bottomRightIndex = 0;

	// maximum dimensions of text detections in game grid
	let maxX = 0;
	let maxY = 0;

	// loop to identify above variables
	for (let i = 1; i < detections.length; i++) {
		const d = detections[i];

		// dimensions of the detection
		d.dim = { pixel: {} };

		d.dim.pixel.x =
			d.boundingPoly.vertices[1].x - d.boundingPoly.vertices[3].x;
		d.dim.pixel.y =
			d.boundingPoly.vertices[3].y - d.boundingPoly.vertices[1].y;

		if (
			d.boundingPoly.vertices[0].y > 300 &&
			dimensions.height - d.boundingPoly.vertices[0].y > 300 &&
			/^[A-Z]+$/.test(d.description)
		) {
			maxX = Math.max(d.dim.pixel.x, maxX);
			maxY = Math.max(d.dim.pixel.y, maxY);
			// console.log(dim);
			if (!topLeftIndex) {
				topLeftIndex = i;
			}
			bottomRightIndex = i;
		}
	}

	const topLeft = detections[topLeftIndex];
	const bottomRight = detections[bottomRightIndex];

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
	const boxSize =
		(bottomRight.boundingPoly.vertices[0].y -
			topLeft.boundingPoly.vertices[0].y) /
		14;
	console.log('boxSize:', boxSize);

	console.log('maxX:', maxX, `%${pixelToPercent(maxX, 'x', dimensions)}`);
	console.log('maxY:', maxY, `%${pixelToPercent(maxY, 'y', dimensions)}`);

	// filter out all non game grid detections
	// and sort left to right and top to bottom
	const sortedAndFiltered = sortAndFilterDetects(
		detections,
		dimensions,
		boxSize
	);

	return {
		boxSize: boxSize,
		dimensions: dimensions,
		gridDetections: sortedAndFiltered,
	};
};

export default parseDetects;
