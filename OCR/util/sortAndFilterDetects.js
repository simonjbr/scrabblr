import fs from 'node:fs';
import bonusTileValues from './bonusTileValues.js';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, isBonus: boolean}[]} detections OCR detections
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @param {number} boxSize size of each square in the game grid
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (detections, dimensions, boxSize) => {
	const sortedAndFiltered = detections
		// may need a more robust pattern in the future
		.filter(
			(d) =>
				d.boundingPoly.vertices[0].y > 300 &&
				dimensions.height - d.boundingPoly.vertices[0].y > 300 &&
				/^[A-Z]+$/.test(d.description)
		);

	// add convenient data to detection objects
	const initialSortedAndFilteredLength = sortedAndFiltered.length;
	for (let i = 0; i < initialSortedAndFilteredLength; i++) {
		const d = sortedAndFiltered[i];

		// add a center vertex to account for varying detection dimensions
		const centerVertex = {};
		centerVertex.x = d.coords.minX + (d.coords.maxX - d.coords.minX) / 2;
		centerVertex.y = d.coords.minY + (d.coords.maxY - d.coords.minY) / 2;
		d.center = centerVertex;

		// calculate dimensions as a proportion of box size
		d.dim.relativeToBox = {};
		d.dim.relativeToBox.x = d.dim.pixel.x / boxSize;
		d.dim.relativeToBox.y = d.dim.pixel.y / boxSize;

		// if detection is 2 chars long and still fits in one box we know it's a bonus square
		d.isBonus = false;
		if (d.description.length === 2 && d.dim.relativeToBox.x < 1) {
			d.isBonus = true;
		}

		// cloud vision can sometimes combine vertically adjancent tiles into one detection
		// should be able to correct by simply taking the first character of the detection
		if (Math.abs(d.dim.relativeToBox.y) > 1) {
			d.description = d.description[0];
		}

		// cloud vision can sometimes combine placed letters and bonus squares into one detection
		// i'll need to determine which portions of the string are tiles/bonuses and
		// split the detect into multiple detects with updated vertices and dimensions
		if (
			d.description.length > 2 &&
			d.dim.relativeToBox.x < d.description.length - 1
		) {
			d.weHaveAProblem = true;
			const beforeSlice = d.description.slice(0, 2);
			const afterSlice = d.description.slice(-2);
			// deep copy of detection object for modifying and adding to detections array
			const splitDetect = JSON.parse(JSON.stringify(d));
			if (bonusTileValues.has(beforeSlice)) {
				console.log('Before');
			} else if (bonusTileValues.has(afterSlice)) {
				console.log('After');
				// remove bonus tile letters from original description;
				d.description = d.description.slice(0, -2);
				// change description to the bonus tile
				splitDetect.description = afterSlice;
				// adjust minX using a rough proportion of boxSize
				splitDetect.coords.minX =
					splitDetect.coords.maxX - 0.6 * boxSize;
				// update pixel and relative x dimensions
				splitDetect.dim.pixel.x =
					splitDetect.coords.maxX - splitDetect.coords.minX;
				splitDetect.dim.relativeToBox.x =
					splitDetect.dim.pixel.x / boxSize;
				// update center x
				splitDetect.center.x =
					splitDetect.coords.minX + splitDetect.dim.pixel.x / 2;
				// push modified detection object to detections array
				sortedAndFiltered.push(splitDetect);
			}
		}
	}

	// sorting must account for fuzziness
	sortedAndFiltered
		.sort((a, b) =>
			Math.abs(
				a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x
			) > 16
				? a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x
				: 0
		)
		.sort((a, b) =>
			Math.abs(
				a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
			) > 16
				? a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
				: 0
		);

	fs.writeFileSync(
		'./OCR/results/sortedAndFiltered.json',
		JSON.stringify({ sortedAndFiltered }),
		'utf8'
	);
	console.log('sortedAndFiltered.length:', sortedAndFiltered.length);

	return sortedAndFiltered;
};

export default sortAndFilterDetects;
