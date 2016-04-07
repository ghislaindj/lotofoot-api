import express from 'express';
import gameRoutes from './game';

const router = express.Router();

/** Check service health */
router.get('/', (req, res) =>
    res.status(200).json({
        status: "up"
    })
);

// mount game routes at /games
router.use('/games', gameRoutes);

export default router;