import express from 'express';

const router = express.Router();

// /api/cloudVision
// receives uploaded screenshot and returns the boardState and hand
router.post('/', (req, res) => {
	res.send('Image received');
});

export default router;
