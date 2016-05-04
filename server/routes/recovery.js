import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import recoveryCtrl from '../controllers/recovery';
import APIError from '../helpers/APIError';

const router = express.Router();

router.route('/')
    /** GET /api/reset-password */
    .post(validate(paramValidation.resetPasswordCreate), recoveryCtrl.create);


router.route('/:accessToken')
    /* GET /api/reset-password/:passwordId . */
   .get(recoveryCtrl.verify)
    /* POST /api/reset-password/:passwordId . */
    .post(validate(paramValidation.resetPasswordUpdate), recoveryCtrl.updatePassword);

export default router;