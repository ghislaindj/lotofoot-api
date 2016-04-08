import Prediction from '../models/prediction';

/**
 * Load prediction and append to req.
 */
function load(req, res, next, id) {
    Prediction.get(id).then((prediction) => {
        req.prediction = prediction;
        return next();
    }).error((e) => next(e));
}

/**
 * Get prediction
 * @returns {Prediction}
 */
function get(req, res) {
    return res.json(req.prediction);
}

/**
 * Create new prediction
 * @property {string} req.body.predictionname - The predictionname of prediction.
 * @property {string} req.body.mobileNumber - The mobileNumber of prediction.
 * @returns {Prediction}
 */
function create(req, res, next) {
    const prediction = new Prediction({
        game: req.body.gameId || (req.body.game && req.body.game._id),
        user: req.user.id,
        scoreTeamA: req.body.scoreTeamA,
        scoreTeamB: req.body.scoreTeamB,
        winner: req.body.winner
    });

    prediction.saveAsync()
        .then((savedPrediction) => res.json(savedPrediction))
        .error((e) => next(e));
}

/**
 * Get prediction list.
 * @property {number} req.query.skip - Number of predictions to be skipped.
 * @property {number} req.query.limit - Limit number of predictions to be returned.
 * @returns {Prediction[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0, game, user } = req.query;
    Prediction.list({ limit, skip, game, user }).then((predictions) =>  res.json(predictions))
        .error((e) => next(e));
}

export default { load, get, create, list};