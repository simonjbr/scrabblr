import fs from 'node:fs';

/**
 *
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

const getDetectsFromCache = () => {
	try {
		const detections = JSON.parse(
			fs.readFileSync('./OCR/results/detections.json', 'utf8')
		).detections;

		return detections;
	} catch (error) {
		console.error(error.message);
		return false;
	}
};

export default getDetectsFromCache;
