import fs from 'node:fs';
import bonusTileValues from './bonusTileValues.js';
import filterDuplicates from './filterDuplicates.js';
import filterOverlapping from './filterOverlapping.js';
import getMinMaxVertices from './getMinMaxVertices.js';
import getCenterVertex from './getCenterVertex.js';
import getDetectionDimensions from './getDetectionDimensions.js';

/**
 *
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}} dimensions dimensions of the screenshot
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} symbols simplified fullTextAnnotation structure
 * @returns {{description: string, symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number}[], boundingBox: {vertices: {x: number, y: number}[]}, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (dimensions, symbols) => {
	const BONUS_TILE_X_DIMENSION = 0.6;

	// filter out non game grid detections
	let sortedAndFiltered = symbols.filter((d) => d.isGameGrid);
	// add convenient data to detection objects and correct erroneous detections
	const initialSortedAndFilteredLength = sortedAndFiltered.length;
	for (let i = 0; i < initialSortedAndFilteredLength; i++) {
		const d = sortedAndFiltered[i];

		if (d.ignore) continue;

		// cloud vision can sometimes see character patterns in the layout of tiles
		if (Math.abs(d.dim.relativeToBox.y) > 1) d.ignore = true;

		// cloud vision can also confuse a grid line between two tiles with an 'I'
		if (d.text === 'I') {
			// if the center X falls on or close to a grid line we ignore it
			const isOnGridLine =
				d.center.x % dimensions.boxSize < 5 ||
				d.center.x % dimensions.box;
			d.ignore = isOnGridLine;
		}
	}

	// filter out duplicate detections
	sortedAndFiltered = filterDuplicates(sortedAndFiltered);

	// sorting must account for fuzziness
	sortedAndFiltered
		.sort((a, b) =>
			Math.abs(a.coords.minX - b.coords.minX) > dimensions.fuzziness
				? a.coords.minX - b.coords.minX
				: 0
		)
		.sort((a, b) =>
			Math.abs(a.coords.minY - b.coords.minY) > dimensions.fuzziness
				? a.coords.minY - b.coords.minY
				: 0
		);

	// filter out overlapping detections
	filterOverlapping(sortedAndFiltered, dimensions.boxSize);

	fs.writeFileSync(
		'./OCR/results/sortedAndFiltered.json',
		JSON.stringify({ sortedAndFiltered }),
		'utf8'
	);
	console.log('sortedAndFiltered.length:', sortedAndFiltered.length);

	return sortedAndFiltered;
};

export default sortAndFilterDetects;
