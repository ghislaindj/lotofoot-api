import Joi from 'joi';

export default {
    updateGame: {
        body: {
            scoreTeamA: Joi.number().integer().min(0),
            scoreTeamB: Joi.number().integer().min(0),
            winner: Joi.string().valid(['teamA', 'teamB', 'nobody']),
            status: Joi.string().valid(['NOT_STARTED', 'IN_PROGRESS', 'FINISHED'])
        }
    },
    registerUser: {
        body: {
            email: Joi.string().email().required(),
            username: Joi.string().required(),
            password: Joi.string().min(3).max(20).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string()
        }
    },
    loginUser: {
        body: {
            username: Joi.string().required(),
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
    },
    updatePrediction: {
        body: {
            scoreTeamA: Joi.number().integer().min(0),
            scoreTeamB: Joi.number().integer().min(0),
            winner: Joi.string().valid(['teamA', 'teamB', 'nobody'])
        }
    },
    resetPasswordCreate: {
        body: {
            email: Joi.string().email().required()
        }
    },
    resetPasswordUpdate: {
        body: {
            password: Joi.string().min(3).max(20).required()
        }
    },
    sendValidationEmail: {
        body: {
            email: Joi.string().email().required()
        }
    },
    createMessage: {
        body: {
            text: Joi.string().required()
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
