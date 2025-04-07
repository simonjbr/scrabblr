import express from 'express';
import upload from '../../config/multer.js';
import getDocumentOCR from '../../OCR/util/getDocumentOCR.js';
import parseDetects from '../../OCR/util/parseDetects.js';
import createBoardState from '../../OCR/util/createBoardState.js';
import path from 'path';
import fs from 'node:fs';

const router = express.Router();

// /api/cloudVision
// receives uploaded screenshot and returns the boardState and hand
router.post('/', upload.single('image'), async (req, res) => {
	// req.file contains:
	// - req.file.buffer: The actual image data
	// - req.file.originalname: The original name of the uploaded file
	// - req.file.mimetype: The file's MIME type (e.g., "image/jpeg")
	if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

	try {
		const result = {
			boardState: [],
			hand: [],
		};

		const filePath = './' + req.file.destination + req.file.filename;

		const { dimensions, symbols } = await getDocumentOCR(filePath);

		const parsedDetects = parseDetects(dimensions, symbols);

		await fs.unlink(filePath, (error) => {
			if (error) {
				console.error(error);
			} else {
				console.log('File deleted after processing');
			}
		});

		result.hand = parsedDetects.hand;
		result.boardState = createBoardState(parsedDetects);

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
});

export default router;
