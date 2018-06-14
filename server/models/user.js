import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import bcrypt from 'bcryptjs';
import Prediction from './prediction';
import crypto from 'crypto';
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
    username: {
        type: String,
        required: true,
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
    hasPaid: {
        type: Boolean,
        default: false
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    emailValidationToken: {
        type: String
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
        console.log("%s points for user : %s", points, user._id);

        user.points = points;
        this.points = points;

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
            console.log("user to be saved", user);

            return next();
        }
    })
});

UserSchema.pre('save', function (next) {
    if(_.isUndefined(this.username)) {
        this.username = this.email;
    }
    next();
});

UserSchema.pre('save', function (next) {
    if(_.isUndefined(this.emailValidationToken) || _.isEmpty(this.emailValidationToken)) {
        const buf = crypto.randomBytes(48);
        const token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

        this.emailValidationToken = token;
    }
    next();
});

UserSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        var retJson = {
            _id: ret._id,
            email: ret.email,
            username: ret.username,
            admin: ret.admin,
            firstName: ret.firstName,
            lastName: ret.lastName,
            hasPaid: ret.hasPaid,
            emailValidated: ret.emailValidated,
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
    list({ skip = 0, limit = 500 } = {}) {
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
    },

    /**
     * FindbyUsernameOrEmail
     * @param {ObjectId} param : email or username
     * @returns {Promise<User, APIError>}
     */
    findByUsernameOrEmail(param) {
        return this.findOne({$or:[ {'email': param}, {'username': param}]})
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