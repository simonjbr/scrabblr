import express from 'express';

const router = express.Router();

import cloudVisionRoutes from './cloudVisionRoutes.js';

router.use('/cloudVision', cloudVisionRoutes);

export default router;
