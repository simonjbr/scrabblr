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

const getOCR = async (imagePath) => {
	const response = await client.textDetection(imagePath);
	const result = response[0];
	console.log('result:', result);
	const detections = result.textAnnotations;
	console.log('detections:');
	detections.forEach((text) => console.log(text));

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
};

export default getOCR;
