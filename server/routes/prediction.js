import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import predictionCtrl from '../controllers/prediction';
import auth from '../helpers/auth';

const router = express.Router();

router.route('/')
    /** GET /api/predictions - Get list of predictions */
    .get(auth.ensureAuth, predictionCtrl.list)

    /** POST /api/predictions - Create new prediction */
    .post(auth.ensureAuth, validate(paramValidation.createPrediction), predictionCtrl.create);

router.route('/:predictionId')
    /** GET /api/predictions/:predictionId - Get prediction */
    .get(auth.ensureAuth,predictionCtrl.get)

    // /** PUT /api/predictions/:predictionId - Update prediction */
    .put(auth.ensureAuth, validate(paramValidation.updatePrediction), predictionCtrl.update)

    // /** DELETE /api/predictions/:predictionId - Delete prediction */
    // .delete(predictionCtrl.remove);

/** Load prediction when API with predictionId route parameter is hit */
router.param('predictionId', predictionCtrl.load);

export default router;