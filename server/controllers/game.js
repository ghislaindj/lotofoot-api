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
 * Load next or current games
* @property {number} req.query.limit - Limit number of games to be returned.
 */
function next(req, res) {
    const { limit = 3 } = req.query;
    Game.next({ limit }).then((games) =>  res.json(games))
        .error((e) => next(e));
}


/**
 * Update existing game
 * @returns {Game}
 */
function update(req, res, next) {
    const game = req.game;

    game.scoreTeamA = req.body.scoreTeamA ? req.body.scoreTeamA : game.scoreTeamA;
    game.scoreTeamB = req.body.scoreTeamB ? req.body.scoreTeamB : game.scoreTeamB;
    game.winner = req.body.winner ? req.body.winner : game.winner;
    game.status = req.body.status ? req.body.status : game.status;

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

export default { load, get, list, update, next};