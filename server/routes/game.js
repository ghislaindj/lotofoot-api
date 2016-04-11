import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import gameCtrl from '../controllers/game';
import ensureAuth from '../helpers/ensure-authenticated';

const router = express.Router();

router.route('/')
    /** GET /api/games - Get list of games */
    .get(gameCtrl.list)

router.route('/next')
    /** GET /api/games/next - Get next or current game */
    .get(gameCtrl.next);


router.route('/:gameId')
    /** GET /api/games/:gameId - Get game */
    .get(gameCtrl.get)

    // /** PUT /api/games/:gameId - Update game */
    .put(ensureAuth, validate(paramValidation.updateGame), gameCtrl.update)

/** Load game when API with gameId route parameter is hit */
router.param('gameId', gameCtrl.load);

export default router;