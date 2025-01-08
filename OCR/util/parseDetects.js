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

	// loop to identify above variables
	for (let i = 1; i < detections.length; i++) {
		const d = detections[i];

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

		d.dim.pixel.x =
			d.coords.maxX - d.coords.minX;
		d.dim.pixel.y =
			d.coords.maxY - d.coords.minY;

		if (
			d.boundingPoly.vertices[0].y > 300 &&
			dimensions.height - d.boundingPoly.vertices[0].y > 300 &&
			/^[A-Z]+$/.test(d.description)
		) {
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
