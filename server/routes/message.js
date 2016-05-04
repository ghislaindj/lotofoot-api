import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import messageCtrl from '../controllers/message';
import auth from '../helpers/auth';

const router = express.Router();

router.route('/')
    /** GET /api/messages - Get list of messages */
    .get(auth.ensureAuth, messageCtrl.list)

    /** POST /api/messages - Create new message */
    .post(auth.ensureAuth, validate(paramValidation.createMessage), messageCtrl.create);

router.route('/:messageId')
    /** GET /api/messages/:messageId - Get message */
    .get(auth.ensureAuth,messageCtrl.get)

/** Load message when API with messageId route parameter is hit */
router.param('messageId', messageCtrl.load);

export default router;