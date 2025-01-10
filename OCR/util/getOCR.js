import 'dotenv/config';
import vision from '@google-cloud/vision';
import fs from 'node:fs';

const CREDENTIALS = JSON.parse(process.env.CLOUD_VISION_CRED || {});

const CONFIG = {
	credentials: {
		private_key: CREDENTIALS.private_key,
		client_email: CREDENTIALS.client_email,
	},
};

const client = new vision.ImageAnnotatorClient(CONFIG);

/**
 *
 * @param {string} imagePath path to screenshot
 * @returns {{description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[]}
 */

const getOCR = async (imagePath) => {
	try {
		const response = await client.textDetection(imagePath);
		const result = response[0];
		const detections = result.textAnnotations;

		fs.writeFileSync(
			'./OCR/results/response.json',
			JSON.stringify({ response }),
			'utf8'
		);

		fs.writeFileSync(
			'./OCR/results/result.json',
			JSON.stringify({ result }),
			'utf8'
		);

		fs.writeFileSync(
			'./OCR/results/detections.json',
			JSON.stringify({ detections }),
			'utf8'
		);

		return detections;
	} catch (error) {
		console.error(error.message);
		return error;
	}
};

export default getOCR;
