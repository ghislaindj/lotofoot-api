import Game from '../models/game';
import Team from '../models/team';

/**
 * Load game and append to req.
 */
function load(req, res, next, id) {
    Game.get(id).then((game) => {
        req.game = game;
        return next();
    }).error((e) => next(e));
}

/**
 * Get game
 * @returns {Game}
 */
function get(req, res) {
    return res.json(req.game);
}

/**
 * Create new game
 * @property {string} req.body.gamename - The gamename of game.
 * @property {string} req.body.mobileNumber - The mobileNumber of game.
 * @returns {Game}
 */
function create(req, res, next) {
    const game = new Game({
        gamename: req.body.gamename,
    });

    game.saveAsync()
        .then((savedGame) => res.json(savedGame))
        .error((e) => next(e));
}

/**
 * Get game list.
 * @property {number} req.query.skip - Number of games to be skipped.
 * @property {number} req.query.limit - Limit number of games to be returned.
 * @returns {Game[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Game.list({ limit, skip }).then((games) =>  res.json(games))
        .error((e) => next(e));
}

export default { load, get, create, list};