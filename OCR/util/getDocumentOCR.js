import 'dotenv/config';
import vision from '@google-cloud/vision';
import fs from 'node:fs';
import getMinMaxVertices from './getMinMaxVertices.js';
import getCenterVertex from './getCenterVertex.js';
import getDetectionDimensions from './getDetectionDimensions.js';
import getDimensions from './getDimensions.js';

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
 * @returns {{dimensions: {height: number, width: number, gridStart: number, gridEnd: number, handDim: number, fuzziness: number, boxSize: number}, symbols: {boundingBox: {vertices: {x: number, y: number}[]}, text: string, confidence: number, coords: {minX: number, minY: number, maxX: number, maxY: number}, dim: {pixel: {x: number, y: number}, relativeToBox: {x: number, y: number}}, center: { x: number, y: number}, minXPositionWithinBox: number, isBonus: boolean, isGameGrid: boolean, isHand: boolean, ignore: boolean}[]}}
 */

const getDocumentOCR = async (imagePath) => {
	try {
		const response = await client.documentTextDetection(imagePath);
		const result = response[0];
		const fullTextAnnotations = result.fullTextAnnotation.pages[0].blocks;

		// simplified fullTextAnotation structure
		const detailedWords = [];

		// further simplified fullTextAnnotation structure
		const symbols = [];

		// get dimension data
		const width = result.fullTextAnnotation.pages[0].width;
		const height = result.fullTextAnnotation.pages[0].height;

		const dimensions = getDimensions(width, height);

		for (let i = 0; i < fullTextAnnotations.length; i++) {
			const block = fullTextAnnotations[i];
			for (const paragraph of block.paragraphs) {
				for (const word of paragraph.words) {
					detailedWords.push(word);
					for (const symbol of word.symbols) {
						// skip over low confidence symbols
						if (symbol.confidence < 0.4) continue;
						// vertices aren't always in the same order so i correct by using max mins of each axis
						symbol.coords = getMinMaxVertices(
							symbol.boundingBox.vertices
						);
						// add a center vertex to account for varying detection dimensions
						symbol.center = getCenterVertex(symbol.coords);
						// dimensions of the detection in pixels and relative to boxSize
						symbol.dim = getDetectionDimensions(
							symbol.coords,
							dimensions.boxSize
						);

						// flags for sorting and filtering
						// will be set in parseDetects
						symbol.isGameGrid = false;
						symbol.isHand = false;
						symbol.isBonus = false;
						symbol.ignore = false;

						// the distance between the start of the grid square (left)
						// and the start of the detection area
						// useful for differentiating letters, tile scores and bonus tiles
						symbol.minXPositionWithinBox =
							(symbol.coords.minX % dimensions.boxSize) /
							dimensions.boxSize;

						// figuring out column and row would be useful here!

						symbols.push(symbol);
					}
				}
			}
		}

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
			JSON.stringify({ symbols, dimensions }),
			'utf8'
		);

		return { dimensions, symbols };
	} catch (error) {
		console.error(error.message);
		return error;
	}
};

export default getDocumentOCR;
