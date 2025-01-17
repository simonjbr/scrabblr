import fs from 'node:fs';
import bonusTileValues from './bonusTileValues.js';
import filterDuplicates from './filterDuplicates.js';

/**
 *
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number}} dimensions dimensions of the screenshot
 * @param {number} boxSize size of each square in the game grid
 * @param {{description: string, symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number}[], boundingBox: {vertices: {x: number, y: number}[]}, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]} detailedWords simplified fullTextAnnotation structure
 * @returns {{description: string, symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number}[], boundingBox: {vertices: {x: number, y: number}[]}, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (dimensions, boxSize, detailedWords) => {
	const BONUS_TILE_X_DIMENSION = 0.6;

	// filter out non game grid detections
	let sortedAndFiltered = detailedWords.filter((d) => d.isGameGrid);
	// add convenient data to detection objects and correct erroneous detections
	const initialSortedAndFilteredLength = sortedAndFiltered.length;
	for (let i = 0; i < initialSortedAndFilteredLength; i++) {
		const d = sortedAndFiltered[i];

		// calculate dimensions as a proportion of box size
		d.dim.relativeToBox = {};
		d.dim.relativeToBox.x = d.dim.pixel.x / boxSize;
		d.dim.relativeToBox.y = d.dim.pixel.y / boxSize;

		// if detection is 2 chars long and still fits in one box we know it's a bonus square
		d.isBonus = false;
		if (
			d.description.length === 2 &&
			d.dim.relativeToBox.x < 1 &&
			d.dim.relativeToBox.y < 1
		) {
			d.isBonus = true;
		}

		// cloud vision can sometimes combine vertically adjancent tiles into one detection
		// split these into single letter detections and adjust minY and maxY for each
		if (Math.abs(d.dim.relativeToBox.y) > 1) {
			// can sometimes see character patterns in the layout of tiles
			if (d.description.length !== 1) {
				for (let i = 0; i < d.description.length; i++) {
					const letter = d.description.charAt(i);

					const splitDetect = JSON.parse(JSON.stringify(d));

					splitDetect.description = letter;
					splitDetect.coords.minY = d.coords.minY + i * boxSize;
					splitDetect.coords.maxY =
						d.coords.maxY -
						(d.description.length - 1 - i) * boxSize;

					sortedAndFiltered.push(splitDetect);
				}
			} else {
				d.ignore = true;
			}
			d.description = '';
		}

		// cloud vision can sometimes combine placed letters and bonus squares into one detection
		// i'll need to determine which portions of the string are tiles/bonuses and
		// split the detect into multiple detects with updated vertices and dimensions
		if (
			d.description.length > 2 &&
			d.dim.relativeToBox.x < d.description.length - 1
		) {
			d.weHaveAProblem = true;

			for (let i = 0; i < d.description.length - 1; i++) {
				const slices = [];
				// split description into beforeSlice, slice and afterSlice
				slices.push(
					d.description.slice(0, i),
					d.description.slice(i, i + 2),
					d.description.slice(i + 2)
				);

				// if slice is a bonus tile split there
				if (bonusTileValues.has(slices[1])) {
					let minXDelta = 0;
					for (let i = 0; i < slices.length; i++) {
						const s = slices[i];
						if (!s) continue;
						// deep copy current detection for modification
						const splitDetect = JSON.parse(JSON.stringify(d));

						splitDetect.isBonus = i === 1;

						// update description coords and dimensions
						splitDetect.description = s;

						splitDetect.coords.minX += minXDelta;
						splitDetect.coords.maxX =
							splitDetect.coords.minX +
							(i === 1 ? 1 : s.length) * boxSize;

						splitDetect.center.x =
							splitDetect.coords.minX +
							(splitDetect.coords.maxX -
								splitDetect.coords.minX) /
								2;

						splitDetect.dim.pixel.x =
							splitDetect.coords.maxX - splitDetect.coords.minX;
						splitDetect.dim.relativeToBox.x =
							splitDetect.dim.pixel.x / boxSize;

						// update the delta for the next iteration
						minXDelta += (i === 1 ? 1 : s.length) * boxSize;

						// push modified detection object to detections array
						sortedAndFiltered.push(splitDetect);
					}
					d.ignore = true;
					break;
				}
			}

			// cloud vision can also confuse a grid line between two letters with an 'I'
			if (d.description.includes('I')) {
				const iIndex = d.description.indexOf('I');
				// calculate center X vertex of the 'I'
				// first we need min/max X values for the 'I'
				let minX = d.symbols[iIndex].boundingBox.vertices[0].x;
				let maxX = 0;

				for (const vertex of d.symbols[iIndex].boundingBox.vertices) {
					minX = Math.min(vertex.x, minX);
					maxX = Math.max(vertex.x, maxX);
				}

				const centerX = minX + (maxX - minX) / 2;

				// check if centerX falls on or close to a grid line (within 5 pixels)
				const isOnGridLine = centerX % boxSize < 5;
				if (isOnGridLine) {
					d.description =
						d.description.slice(0, iIndex) +
						d.description.slice(iIndex + 1);
				}
			}
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

	fs.writeFileSync(
		'./OCR/results/sortedAndFiltered.json',
		JSON.stringify({ sortedAndFiltered }),
		'utf8'
	);
	console.log('sortedAndFiltered.length:', sortedAndFiltered.length);

	return sortedAndFiltered;
};

export default sortAndFilterDetects;
