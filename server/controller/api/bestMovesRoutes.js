import express from 'express';
import getValidWords from '../../algorithm/permAlgorithm.js';

const router = express.Router();

// /api/bestMoves
// receives hand and boardState and serves best moves
router.post('/', (req, res) => {
	if (!req.body.board || !req.body.hand)
		return res.status(400).json({ error: 'No board or hand was provided' });

	try {
		const validWords = getValidWords(req.body.hand, req.body.board, req.body.gameType);

		res.status(200).json(validWords[0].slice(0, 10));
	} catch (error) {
		console.error(error);
	}
});

export default router;
