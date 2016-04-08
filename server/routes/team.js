import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import teamCtrl from '../controllers/team';

const router = express.Router(); 

router.route('/')
    /** GET /api/teams - Get list of teams */
    .get(teamCtrl.list)

router.route('/:teamId')
    /** GET /api/teams/:teamId - Get team */
    .get(teamCtrl.get)

/** Load team when API with teamId route parameter is hit */
router.param('teamId', teamCtrl.load);

export default router;