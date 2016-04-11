import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Prediction Schema
 */
const PredictionSchema = new mongoose.Schema({
        game: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Game',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        scoreTeamA: {
            type: Number
        },
        scoreTeamB: {
            type: Number
        },
        winner: {
            type: String,
            enum: ['teamA', 'teamB', 'nobody']
        },
        score: {
            type: Number
        }
    }, {
        timestamps: true
    }
);

PredictionSchema.index({ game: 1, user: 1 }, { unique: true });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

PredictionSchema.virtual('isOpen').get(function() {
    return !(this.game && this.game.hasStarted);
});

PredictionSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            scoreTeamA: ret.scoreTeamA,
            scoreTeamB: ret.scoreTeamB,
            winner: ret.winner,
            game: ret.game,
            isOpen: ret.isOpen,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
        return retJson;
    }
});

/**
 * Methods
 */
PredictionSchema.method({
});

/**
 * Statics
 */
PredictionSchema.statics = {
    /**
     * Get prediction
     * @param {ObjectId} id - The objectId of prediction.
     * @returns {Promise<Prediction, APIError>}
     */
    get(id) {
        return this.findById(id)
            .populate('game')
            .execAsync().then((prediction) => {
                if (prediction) {
                    return prediction;
                }
                const err = new APIError('No such prediction exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List predictions in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of predictions to be skipped.
     * @param {number} limit - Limit number of predictions to be returned.
     * @returns {Promise<Prediction[]>}
     */
    list({ skip = 0, limit = 50, game, user } = {}) {
        let filters = {};
        if(game) filters.game = game;
        if(user) filters.user = user;

        return this.find(filters)
            .sort({ datetime: 1 })
            .skip(skip)
            .limit(limit)
            .populate('game')
            .execAsync();
    }
};

/**
 * @typedef Prediction
 */
export default mongoose.model('Prediction', PredictionSchema);