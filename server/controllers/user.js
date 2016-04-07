import User from '../models/user';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.get(id).then((user) => {
        req.user = user;
        return next();
    }).error((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @returns {User}
 */
function register(req, res, next) {
    const user = new User({
        username: req.body.username,
    });

    user.saveAsync()
        .then((savedUser) => res.json(savedUser))
        .error((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip }).then((users) =>  res.json(users))
        .error((e) => next(e));
}

export default { load, get, login, register, list};