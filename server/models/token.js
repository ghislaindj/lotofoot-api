import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import crypto from 'crypto';
import moment from 'moment-timezone';
moment.tz.setDefault('Europe/Paris');

/**
 * Token Schema
 */
const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        index: true
    },
    accessToken: {
        type: String, 
        index: true
    },
    expires: {
        type: Date,
        default: moment().add(2, 'hours')
    }
}, {
        timestamps: true
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
TokenSchema.method({
    hasExpired() {
        return moment() > this.expires;
    }
});

/**
 * Statics
 */
TokenSchema.statics = {
    /**
     * New token
     * @param {ObjectId} userId - The objectId of user.
     * @returns {Promise<Token, APIError>}
     */
    new(userId) {
        let token = new this();

        const buf = crypto.randomBytes(48);
        const accessToken = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

        token.accessToken = `${userId}|${accessToken}`;
        token.user = userId;

        return token.saveAsync();
    },

    /**
     * Get token
     * @param {ObjectId} id - The objectId of token.
     * @returns {Promise<Token, APIError>}
     */
    getByAccessToken(accessToken) {
        return this.findOne({accessToken})
            .execAsync().then((token) => {
                if (token && !token.hasExpired()) {
                    return token;
                } else if(token) {
                    const err = new APIError('Token Expired', httpStatus.UNAUTHORIZED);
                    return Promise.reject(err);
                }
                const err = new APIError('No such token exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }

};

/**
 * @typedef Token
 */
export default mongoose.model('Token', TokenSchema);