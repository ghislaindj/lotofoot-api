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
                firstName: Joi.string().required()
        }
    },
    loginUser: {
        body: {
                email: Joi.string().email().required(),
                password: Joi.string().min(3).max(20).required()
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
