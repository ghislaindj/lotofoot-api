import Token from '../models/token';
import User from '../models/user';
import passport from 'passport';
import APIError from '../helpers/APIError';
import config from '../../config/env';
import httpStatus from 'http-status';
import mailer from '../mailer/mailer';
import jwt from 'jsonwebtoken';

/**
 * Send validation email
 * @property {string} req.body.email - The email of user.
 */
 function sendValidationEmail(req, res, next) {
    User.findByEmail(req.body.email)
    .then((user) => {
        if(user && !user.emailValidated) {
            return user.saveAsync()
            .then((user) => {
                return mailer.sendConfirmationEmail(user, user.emailValidationToken)
            })
            .then(function() {
                return res.sendStatus(httpStatus.OK);
            }, error => {
                console.log("error", error);
            })
        } else {
            return res.sendStatus(httpStatus.OK);
        }
    })
    .error((e) => next(e));
}

/**
 * Verify Email
 */
 function verifyEmail(req, res, next) {
    const validationToken = req.query.token;
    const email = req.query.email;
    console.log("email", email);
    if(validationToken && email) {
        User.findByEmail(email)
        .then((user) => {
            if(user && (user.emailValidationToken == validationToken)) {
                user.emailValidated = true
                return user.saveAsync()
                .then((savedUser) => {
                    console.log("savedUser", savedUser);
                    res.redirect(301, `${config.webUrl}/games?msg=new`);
                })
            } else {
              return res.sendStatus(httpStatus.NOT_FOUND);
            }
        })
    }
}

export default { sendValidationEmail, verifyEmail };