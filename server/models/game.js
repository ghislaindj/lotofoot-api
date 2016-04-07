import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Game Schema
 */
const GameSchema = new mongoose.Schema({
    gamename: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
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
GameSchema.method({
});

/**
 * Statics
 */
GameSchema.statics = {
    /**
     * Get game
     * @param {ObjectId} id - The objectId of game.
     * @returns {Promise<Game, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((game) => {
                if (game) {
                    return game;
                }
                const err = new APIError('No such game exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List games in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of games to be skipped.
     * @param {number} limit - Limit number of games to be returned.
     * @returns {Promise<Game[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .execAsync();
    }
};

/**
 * @typedef Game
 */
export default mongoose.model('Game', GameSchema);