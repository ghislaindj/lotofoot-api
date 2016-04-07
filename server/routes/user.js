import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user';

const router = express.Router();

router.route('/')
    /** GET /api/users - Get list of users */
    .get(userCtrl.list)

router.route('/register')
    .post(validate(paramValidation.registerUser), userCtrl.register);

router.route('/login')
    .post(validate(paramValidation.loginUser), userCtrl.login);

router.route('/:userId')
    /** GET /api/users/:userId - Get user */
    .get(userCtrl.get)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;