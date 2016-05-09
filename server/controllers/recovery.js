import Token from '../models/token';
import User from '../models/user';
import passport from 'passport';
import APIError from '../helpers/APIError';
import config from '../../config/env';
import httpStatus from 'http-status';
import mailer from '../mailer/mailer';
import jwt from 'jsonwebtoken';

/**
 * Load token and append to req.
 */
function load(req, res, next, id) {
    Prediction.get(id).then((prediction) => {
        req.prediction = prediction;
        return next();
    }).error((e) => next(e));
}

/**
 * Create new recoveryPassword
 * @property {string} req.body.email - The email of user.
 */
function create(req, res, next) {
    User.findByEmail(req.body.email)
    .then((user) => {
        if(user) {
            return Token.new(user.id)
                .then((token) => {
                    return mailer.sendPasswordResetEmail(user, token.accessToken);
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
 * Verify Token
 */
function verify(req, res, next) {
    Token.getByAccessToken(req.params.accessToken)
        .then((token) => res.json(token))
        .error((e) => next(e));
}



/**
 * Update Password
 * @returns {User}
 */
function updatePassword(req, res, next) {
    Token.getByAccessToken(req.params.accessToken)
    .then((token) => {
        return User.get(token.user)
    })
    .then((user) => {
        user.password = req.body.password
        return user.saveAsync();
    })
    .then((savedUser) => {
        var token = jwt.sign({ id: savedUser.id, pass: savedUser.password}, config.secret, {expiresIn: config.expiresIn});

        res.json({
          user: savedUser,
          token: token
        });
    })
    .error((e) => next(e));
}

export default { create, verify, updatePassword };