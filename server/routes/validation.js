import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import validationCtrl from '../controllers/validation';
import APIError from '../helpers/APIError';

const router = express.Router();

router.route('/')
    /** GET /api/validation */
    .post(validate(paramValidation.sendValidationEmail), validationCtrl.sendValidationEmail)
    /* GET /api/validation?email=john@gmail.com&token=token . */
    .get(validationCtrl.verifyEmail);

export default router;