import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Game from './game';
import User from './user';

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        text: {
            type: String
        }
    }, {
        timestamps: true
    }
);


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */



/**
 * Methods
 */
MessageSchema.method({

});

/**
 * Statics
 */
MessageSchema.statics = {
    /**
     * Get message
     * @param {ObjectId} id - The objectId of message.
     * @returns {Promise<Message, APIError>}
     */
    get(id) {
        return this.findById(id)
            .populate('user')
            .execAsync().then((message) => {
                if (message) {
                    return message;
                }
                const err = new APIError('No such message exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List messages in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of messages to be skipped.
     * @param {number} limit - Limit number of messages to be returned.
     * @returns {Promise<Message[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user')
            .execAsync();
    }
};

/**
 * @typedef Message
 */
export default mongoose.model('Message', MessageSchema);