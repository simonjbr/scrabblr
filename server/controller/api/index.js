import express from 'express';

const router = express.Router();

import cloudVisionRoutes from './cloudVisionRoutes.js';
import bestMovesRoutes from './bestMovesRoutes.js';

router.use('/cloudVision', cloudVisionRoutes);
router.use('/bestMoves', bestMovesRoutes);

export default router;
