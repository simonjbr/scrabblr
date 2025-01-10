/**
 *
 * @param {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, isBonus: boolean, isGameGrid: boolean}[]} detections OCR detections
 */

// filter out duplicate detections
const filterDuplicates = (detections) => {
	const seen = new Map();
	const filteredDetections = detections.filter((d) => {
		const {
			description,
			coords: { minX, minY },
		} = d;
		if (seen.has(description)) {
			return (
				Math.abs(seen.get(description).minX - minX) > 20 &&
				Math.abs(seen.get(description).minY - minY) > 20
			);
		} else {
			seen.set(description, { minX, minY });
			return true;
		}
	});

	return filteredDetections;
};

export default filterDuplicates;
