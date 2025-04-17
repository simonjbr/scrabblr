/**
 *
 * @param {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} detections OCR detections
 * @params {boolean} isHand boolean indicating if the detection is a hand
 * @description filters out duplicate detections based on their text and coordinates
 * @returns {{boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]} duplicate filtered detections
 */

// filter out duplicate detections
const filterDuplicates = (detections, dimensions, isHand) => {
	const DUPLICATE_FUZZINESS = isHand ? dimensions.duplicateFuzziness * 2 : dimensions.duplicateFuzziness;
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
					Math.abs(existing.minX - minX) < DUPLICATE_FUZZINESS &&
					Math.abs(existing.minY - minY) < DUPLICATE_FUZZINESS
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
