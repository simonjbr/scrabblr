import fs from 'node:fs';
import bonusTileValues from './bonusTileValues.js';
import filterDuplicates from './filterDuplicates.js';

/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]} detections OCR detections
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number}} dimensions dimensions of the screenshot
 * @param {number} boxSize size of each square in the game grid
 * @param {{paragraphs: {words: {symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number}[], boundingBox: {vertices: {x: number, y: number}[]}}[], boundingBox: {vertices: {x: number, y: number}[]}}[], boundingBox: {vertices: {x: number, y: number}[]}}[]} fullTextAnnotations detailed OCR detections
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

// filter out all non game grid detections
// and sort left to right and top to bottom
const sortAndFilterDetects = (
	detections,
	dimensions,
	boxSize,
	fullTextAnnotations
) => {
	const BONUS_TILE_X_DIMENSION = 0.6;

	// filter out non game grid detections
	let sortedAndFiltered = detections.filter((d) => d.isGameGrid);
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
				// bool for breaking early
				let isFixedErrantI = false;
				// find the same detection in the fullTextAnnotations
				// so we can locate the center vertex of the 'I'
				for (const block of fullTextAnnotations) {
					// concatenate symbols of the block to make one description string
					let blockDescription = '';
					for (const symbol of block.paragraphs[0].words[0].symbols) {
						blockDescription += symbol.text;
					}

					const isVerticesEqual =
						JSON.stringify(d.boundingPoly.vertices) ===
						JSON.stringify(block.boundingBox.vertices);

					// if descriptions and vertices are equal it's the right block
					if (blockDescription === d.description && isVerticesEqual) {
						// calculate center X vertex for the 'I'
						// we need min and max X first
						let minX =
							block.paragraphs[0].words[0]?.symbols[iIndex]
								.boundingBox.vertices[0].x;
						let maxX = 0;

						for (const vertex of block.paragraphs[0].words[0]
							.symbols[iIndex].boundingBox.vertices) {
							minX = Math.min(vertex.x, minX);
							maxX = Math.max(vertex.x, maxX);
						}

						const centerX = minX + (maxX - minX) / 2;

						// check if centerX falls on or close to a grid line (within 5 pixels, say)
						const isOnGridLine = centerX % boxSize < 5;
						if (isOnGridLine) {
							d.description =
								d.description.slice(0, iIndex) +
								d.description.slice(iIndex + 1);
							isFixedErrantI = true;
							break;
						}
					}
				}
			}
			// const pixelsToNextGridLine = (59 / 72) * boxSize;
			// for (let i = 0; i < d.description.length; i++) {
			// 	const char = d.description.charAt(i);

			// 	if (char === 'I') {
			// 		// calculate the center X vertex
			// 		const centerX =
			// 			d.coords.minX + i * boxSize + pixelsToNextGridLine;
			// 		// if center.x % boxSize < (some small range)
			// 		if (centerX % boxSize < 5) {
			// 			// it is likely on a grid line so slice it out of d.description
			// 			d.description.split('').splice(i, 1).join('');
			// 		}
			// 	}
			// }
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
