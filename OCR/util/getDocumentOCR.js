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
 * @returns {{detections: {description: String, boundingPoly: {vertices: {x: number, y: number}[]}}[], dimensions: {width: number, height: number}, fullTextAnnotations: {paragraphs: {words: {symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number}[], boundingBox: {vertices: {x: number, y: number}[]}}[], boundingBox: {vertices: {x: number, y: number}[]}}[]}[]}}
 */

const getDocumentOCR = async (imagePath) => {
	try {
		const response = await client.documentTextDetection(imagePath);
		const result = response[0];
		const detections = result.textAnnotations;
		const fullTextAnnotations = result.fullTextAnnotation.pages[0].blocks;

		// simplified fullTextAnotation structure
		const detailedWords = [];

		for (let i = 0; i < fullTextAnnotations.length; i++) {
			const block = fullTextAnnotations[i];
			for (const word of block.paragraphs[0].words) {
				detailedWords.push(word);
			}
		}

		// get dimension data
		const dimensions = {
			width: result.fullTextAnnotation.pages[0].width,
			height: result.fullTextAnnotation.pages[0].height,
		};

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
			JSON.stringify({ detections, dimensions }),
			'utf8'
		);

		return { detections, dimensions, fullTextAnnotations, detailedWords };
	} catch (error) {
		console.error(error.message);
		return error;
	}
};

export default getDocumentOCR;
