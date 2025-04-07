/**
 *
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} detections OCR detections
 * @returns {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} duplicate filtered detections
 */

// filter out duplicate detections
const filterDuplicates = (detections) => {
	const seen = new Map();
	const filteredDetections = detections.filter((d) => {
		const {
			text,
			coords: { minX, minY },
		} = d;
		if (seen.has(text)) {
			const matches = seen.get(text);
			const isDuplicate = matches.some(
				(existing) =>
					Math.abs(existing.minX - minX) < 20 &&
					Math.abs(existing.minY - minY) < 20
			);

			if (isDuplicate) {
				return false;
			} else {
				matches.push({ minX, minY });
				return true;
			}
		} else {
			seen.set(text, [{ minX, minY }]);
			return true;
		}
	});

	return filteredDetections;
};

export default filterDuplicates;
