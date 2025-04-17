import filterDuplicates from './filterDuplicates.js';

/**
 *
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} detections OCR detections
 * @param {{height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}} dimensions dimensions of the screenshot
 * @returns {string[]}
 */


// parse hand detections
const getHand = (detections, dimensions) => {
	const hand = [];

	// sort hand detections
	detections
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

	// filter any duplicate detections
	const isHand = true;
	detections = filterDuplicates(detections, dimensions, isHand);

	for (let i = 0; i < detections.length; i++) {
		const d = detections[i];

		if (d.text.match(/[^A-Z]/)) continue;

		// need to check for a gap between detections which may indicate a joker
		if (i > 0) {
			const prev = detections[i - 1];
			const gap = d.coords.minX - prev.coords.maxX;

			if (gap > dimensions.handDim) {
				hand.push(...'j'.repeat(Math.round(gap / dimensions.handDim)));
			}
		}

		hand.push(...d.text);
	}

	return hand;
};

export default getHand;
