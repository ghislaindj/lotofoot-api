import Joi from 'joi';

export default {
    // // POST /api/games
    createGame: {
        body: {
            gamename: Joi.string().required()
        }
    },
    registerUser: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().min(3).max(20).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string()
        }
    },
    loginUser: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().min(3).max(20).required()
        }
    },
    createPrediction: {
        body: {
            game: Joi.required(),
            scoreTeamA: Joi.number().integer().min(0).required(),
            scoreTeamB: Joi.number().integer().min(0).required(),
            winner: Joi.string().valid(['teamA', 'teamB', 'nobody']).required()
        }
    }

    // // UPDATE /api/users/:userId
    // updateUser: {
    //     body: {
    //         username: Joi.string().required(),
    //         mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    //     },
    //     params: {
    //         userId: Joi.string().hex().required()
    //     }
    // }
};
