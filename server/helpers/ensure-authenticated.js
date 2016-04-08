import httpStatus from 'http-status';
import APIError from './APIError';
import jwt from 'jwt-simple';
import config from '../../config/env';

export default function(req, res, next) {
    // if (req.isAuthenticated()) {
    //     return next();
    // }

    var token = req.body.token || req.query.token || req.query.access_token || req.headers['x-access-token'];
    const notAuthorizedErr = new APIError('Not authorize', httpStatus.UNAUTHORIZED);

    if (token) {
        try {
            const decoded = jwt.decode(token, config.secret);
            req.user = decoded;
            next();
        } catch (e) {
            console.log("error", e);
            next(notAuthorizedErr);
        }

    } else {
        next(notAuthorizedErr);
    }
}