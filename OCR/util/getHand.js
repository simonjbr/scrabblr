/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, isBonus: boolean, isGameGrid: boolean, isHand: boolean}[]} detections OCR detections
 * @param {{height: number, width: number}} dimensions dimensions of the screenshot
 * @returns {string[]}
 */

// parse hand detections
const getHand = (detections, dimensions) => {
	const hand = [];

	const handBoxSize = dimensions.width / 7;

	for (let i = 0; i < detections.length; i++) {
		const d = detections[i];

		// need to check for a gap between detections which may indicate a joker
		if (i > 0) {
			const prev = detections[i - 1];
			const gap = d.coords.minX - prev.coords.maxX;

			if (gap > handBoxSize) {
				hand.push(...'j'.repeat(Math.round(gap / handBoxSize)));
			}
		}

		hand.push(...d.description);
	}

	return hand;
};

export default getHand;
