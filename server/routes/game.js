import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import gameCtrl from '../controllers/game';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/games - Get list of games */
    .get(gameCtrl.list)

    /** POST /api/games - Create new game */
    .post(validate(paramValidation.createGame), gameCtrl.create);

router.route('/:gameId')
    /** GET /api/games/:gameId - Get game */
    .get(gameCtrl.get)

    // /** PUT /api/games/:gameId - Update game */
    // .put(validate(paramValidation.updategame), gameCtrl.update)

    // /** DELETE /api/games/:gameId - Delete game */
    // .delete(gameCtrl.remove);

/** Load game when API with gameId route parameter is hit */
router.param('gameId', gameCtrl.load);

export default router;