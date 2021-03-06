import httpStatus from 'http-status';
import APIError from './APIError';
import jwt from 'jsonwebtoken';
import config from '../../config/env';

function ensureAuth(req, res, next) {
    var token = req.body.token || req.query.token || req.query.access_token || req.headers['x-access-token'];
    const notAuthorizedErr = new APIError('Not authorize', httpStatus.UNAUTHORIZED);

    if (token) {
        try {
            const decoded = jwt.verify(token, config.secret);
            delete decoded.pass;
            console.log("decoded", decoded);

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

export default { ensureAuth};