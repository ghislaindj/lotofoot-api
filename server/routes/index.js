import express from 'express';
import userRoutes from './user';
import gameRoutes from './game';
import teamRoutes from './team';

const router = express.Router();

/** Check service health */
router.get('/', (req, res) =>
    res.status(200).json({
        status: "up"
    })
);

router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/teams', teamRoutes);

export default router;