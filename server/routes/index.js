import express from 'express';
import userRoutes from './user';
import recoveryRoutes from './recovery';
import gameRoutes from './game';
import teamRoutes from './team';
import predictionRoutes from './prediction';
import messageRoutes from './message';


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
router.use('/predictions', predictionRoutes);
router.use('/reset-password', recoveryRoutes);
router.use('/messages', messageRoutes);

export default router;