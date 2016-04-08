import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user';
import APIError from '../helpers/APIError';
import ensureAuth from '../helpers/ensure-authenticated';

const router = express.Router();

router.route('/')
    /** GET /api/users - Get list of users */
    .get(ensureAuth, userCtrl.list)

router.route('/register')
    .post(validate(paramValidation.registerUser), userCtrl.register);

router.route('/login')
    .post(validate(paramValidation.loginUser), userCtrl.login);

router.route('/me')
    .get(ensureAuth, userCtrl.getCurrentUser)

router.route('/:userId')
    /** GET /api/users/:userId - Get user */
    .get(userCtrl.get)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;