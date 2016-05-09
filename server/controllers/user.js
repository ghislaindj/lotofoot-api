import User from '../models/user';
import passport from 'passport';
import APIError from '../helpers/APIError';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import httpStatus from 'http-status';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.get(id).then((user) => {
        req.user = user;
        return next();
    }).error((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    return res.json(req.user);
}


/**
 * Get current user
 * @returns {User}
 */
function getCurrentUser(req, res, next) {
    console.log("req.user", req.user);
    User.get(req.user.id).then((user) => {
        req.user = user;
        res.json(req.user);
    }).error((e) => next(e));
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @returns {User}
 */
function register(req, res, next) {
    const user = new User({
        email: req.body.email, 
        password: req.body.password, 
        firstName: req.body.firstName
    });

    user.saveAsync()
        .then((savedUser) => {
            var token = jwt.sign({ id: savedUser.id, pass: savedUser.password}, config.secret, {expiresIn: config.expiresIn});

            res.json({
              user: savedUser,
              token: token
            });
        })
        .error((e) => next(e));
}

/**
 * Login a user
 * @property {string} req.body.username - The username of user.
 * @returns {User}
 */
function login(req, res, next) {
    User.findByEmail(req.body.email)
    .then((user) => {
        if (!user) {
            const err = new APIError('Not found', httpStatus.NOT_FOUND);
            next(err);
        }

        if (!user.verifyPassword(req.body.password)) {
            const err = new APIError('Not authorize', httpStatus.UNAUTHORIZED);
            next(err);
        } else {
            var token = jwt.sign({ id: user.id, pass: user.password}, config.secret, {expiresIn: config.expiresIn});

            res.json({
              success: true,
              user: user,
              token: token
            });
        }
    })
    .error((e) => next(e));

}


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip }).then((users) =>  res.json(users))
        .error((e) => next(e));
}


export default { load, get, login, register, list, getCurrentUser};