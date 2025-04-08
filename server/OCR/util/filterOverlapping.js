/**
 *
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} detections OCR detections
 * @param {number} boxSize size of each square in the game grid
 */

// find detections that are in the same grid position and
// ignore the least confident detection
const filterOverlapping = (detections, boxSize) => {
	const topLeft = detections.at(0);

	const usedSquares = new Map();

	for (let i = 0; i < detections.length; i++) {
		const d = detections[i];

		if (d.ignore) continue;

		const {
			coords: { minX, minY },
			text,
			confidence,
		} = d;

		const col = Math.round((minX - topLeft.coords.minX) / boxSize);
		const row = Math.round((minY - topLeft.coords.minY) / boxSize);

		const key = `${col}-${row}`;

		if (usedSquares.has(key)) {
			const match = usedSquares.get(key);
			if (confidence >= match.confidence) {
				detections[match.index].ignore = true;
				match.text = text;
				match.confidence = confidence;
			} else {
				d.ignore = true;
			}
		} else {
			usedSquares.set(key, { text, confidence, index: i });
		}
	}
};

export default filterOverlapping;
