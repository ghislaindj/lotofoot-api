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
    createdAt: {
        type: Date,
        default: Date.now
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
        //console.log("Prediction", Prediction.find({game: game}));

    return Prediction.find({game: game})
        .execAsync()
        .then((predictions) => {
            return Promise.all(_.map(predictions, (prediction) => {
                return prediction.saveAsync();
            }));
        })
        .catch((e) => {
            console.log("error", e);
        })
});


/**
 * Methods
 */
GameSchema.method({
    updateScoreFromFootDb() {
        return getScoreFromFootDB(this)
            .then((score) => {
                                console.log("score updated", score);

                if(_.isUndefined(score)) return;

                _.assign(this, score);
                // if(score.scoreTeamA)    this.scoreTeamA = score.scoreTeamA;
                // if(score.scoreTeamB)    this.scoreTeamB = score.scoreTeamB;
                // if(score.winner)        this.winner     = score.winner;
                // if(score.status)        this.status     = score.status;
                return this.saveAsync();
            })
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
        const beginning = moment().subtract(1, 'day').startOf('day');
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
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ datetime: 1 })
            .skip(skip)
            .limit(limit)
            .populate('teamA teamB')
            .execAsync();
    }


};

/**
 * @typedef Game
 */
export default mongoose.model('Game', GameSchema);