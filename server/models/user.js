import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import bcrypt from 'bcrypt';
import Prediction from './prediction';
import _ from 'lodash';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

UserSchema.index({ points: 1});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function(next) {
    let user = this;
    user.getPoints()
    .then((points) => {
        user.points = points;
        if (user.isModified('password') || user.isNew) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    })
});


UserSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            email: ret.email,
            admin: ret.admin,
            firstName: ret.firstName,
            lastName: ret.lastName,
            points: ret.points,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
        return retJson;
    }
});

/**
 * Methods
 */
UserSchema.method({
    verifyPassword(passwordToTest) {
        return bcrypt.compareSync(passwordToTest, this.password);
    },

    getPoints() {
        var user = this;
        return Prediction.find({user: user})
        .execAsync().then((predictions) => {
            return _.reduce(predictions, (sum, prediction) => {
                return sum + prediction.score;
            }, 0);
        })
    }
});

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .execAsync().then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },


    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ points: -1 })
            .skip(skip)
            .limit(limit)
            .execAsync();
    },


    /**
     * FindbyEmail
     * @param {ObjectId} email - The email of user.
     * @returns {Promise<User, APIError>}
     */
    findByEmail(email) {
        return this.findOne({email})
            .execAsync().then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);