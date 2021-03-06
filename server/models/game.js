import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import moment from 'moment';
import Prediction from './prediction';
import _ from 'lodash';
import getScoreFromFootDB from '../helpers/football-db-update';

/**
 * Game Schema
 */
const GameSchema = new mongoose.Schema({
    friendlyId: {
        type: Number
    },
    date: {
        type: String
    },
    datetime: {
        type: Date
    },
    teamA: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team'
    },
    teamB: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team'
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
    status: {
        type: String,
        enum: ['TIMED', 'IN_PROGRESS', 'FINISHED'],
        default: 'TIMED'
    },
    futureTeamA: {
        type: String
    },
    futureTeamB: {
        type: String
    },
    phase: {
        type: Number
    },
    stadium: {
        type: String
    },
    group: {
        type: String
    },
    channel: {
        type: String
    },
    footDbUrl: {
        type: String
    },
    resultDetails: {
        type: Object
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

GameSchema.virtual('currentStatus').get(function() {
    if(this.status == 'FINISHED') return 'FINISHED';
    if (new Date() > this.datetime) {
        return 'IN_PROGRESS';
    } else {
        return 'TIMED';
    }
});

GameSchema.post('save', function(game) {
    console.log("game %s has been saved", game._id);

    return Prediction.find({game: game._id})
        .execAsync()
        .then((predictions) => {
            console.log("predictions found", predictions);
            return Promise.all(_.map(predictions, (prediction) => {
                return prediction.saveAsync();
            }));
        })
        .catch((e) => {
            console.log("error in post save", e);
        })
});


// GameSchema.post('save', function(game) {
//     console.log("game %s has been saved", game._id);
//     if(game.status == 'FINISHED') {
//         this.find({futureTeamA: })
//     }

//     return Prediction.find({game: game._id})
//         .execAsync()
//         .then((predictions) => {
//             console.log("predictions found", predictions);
//             return Promise.all(_.map(predictions, (prediction) => {
//                 return prediction.saveAsync();
//             }));
//         })
//         .catch((e) => {
//             console.log("error in post save", e);
//         })
// });


/**
 * Methods
 */
GameSchema.method({
    updateScoreFromFootDb() {
        return getScoreFromFootDB(this)
            .then((score) => {
                console.log("score to be updated", score);
                if(_.isUndefined(score) || isNaN(score.scoreTeamA) || isNaN(score.scoreTeamB)) return;

                _.assign(this, score);

                return this.saveAsync();
            })
    },
    hasBeenPredictedBy(userId) {
        return Prediction.findOne({game: this._id, user: userId})
            .execAsync().then(function(prediction) {
                if(prediction) {
                    return true;
                } else {
                    return false;
                }
            });
    }
});

GameSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            friendlyId: ret.friendlyId,
            phase: ret.phase,
            datetime: ret.datetime,
            stadium: ret.stadium,
            teamA: ret.teamA,
            teamB: ret.teamB,
            scoreTeamA: ret.scoreTeamA,
            scoreTeamB: ret.scoreTeamB,
            winner: ret.winner,
            status: ret.currentStatus,
            futureTeamA: ret.futureTeamA,
            futureTeamB: ret.futureTeamB,
            channel: ret.channel,
            group: ret.group,
            isFinished: ret.isFinished,
            resultDetails: ret.resultDetails,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
        return retJson;
    }
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
            .populate('teamA teamB')
            .execAsync().then((game) => {
                if (game) {
                    return game;
                }
                const err = new APIError('No such game exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * Get game
     * @param {ObjectId} id - The objectId of game.
     * @returns {Promise<Game, APIError>}
     */
    getByFriendlyId(friendlyId) {
        return this.findOne({"friendlyId": friendlyId})
            .populate('teamA teamB')
            .execAsync().then((game) => {
                if (game) {
                    return game;
                }
                const err = new APIError('No such game exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * Get next game
     * @param {ObjectId} id - The objectId of game.
     * @returns {Promise<Game, APIError>}
     */
    next({ limit = 3 }) {
        const beginning = moment().startOf('day');
        return this.find({"datetime": {$gte: beginning}, "status": {$ne: ["FINISHED"]}})
            .sort({ datetime: 1 })
            .limit(limit)
            .populate('teamA teamB')
            .execAsync();
    },

    /**
     * Get today games
     * @param {ObjectId} id - The objectId of game.
     * @returns {Promise<Game, APIError>}
     */
    today({ limit = 3 }) {
        const beginning = moment().startOf('day');
        return this.find({"datetime": {$gte: beginning}})
            .sort({ datetime: 1 })
            .limit(limit)
            .populate('teamA teamB')
            .execAsync();
    },

    /**
     * Get yesterday games
     * @param {ObjectId} id - The objectId of game.
     * @returns {Promise<Game, APIError>}
     */
    yesterday({ limit = 3 }) {
        const beginning = moment().startOf('day').subtract(2, 'day');
        return this.find({"datetime": {$gte: beginning}})
            .sort({ datetime: 1 })
            .limit(limit)
            .populate('teamA teamB')
            .execAsync();
    },

    /**
     * List games in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of games to be skipped.
     * @param {number} limit - Limit number of games to be returned.
     * @returns {Promise<Game[]>}
     */
    list({ skip = 0, limit = 64 } = {}) {
        return this.find()
            .sort({ datetime: 1 })
            .skip(skip)
            .limit(limit)
            .populate('teamA teamB')
            .execAsync();
    },

    finished({}) {
        return this.find({"status": "FINISHED"})
            .sort({ datetime: 1 })
            .populate('teamA teamB')
            .execAsync();
    }


};

/**
 * @typedef Game
 */
export default mongoose.model('Game', GameSchema);