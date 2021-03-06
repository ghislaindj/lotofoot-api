import Game from '../models/game';
import Team from '../models/team';
import _ from 'lodash';
import notifier from '../helpers/notifier';

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
    Game.next({ limit: parseInt(limit) }).then((games) =>  res.json(games))
        .error((e) => next(e));
}


/**
 * Update existing game
 * @returns {Game}
 */
function update(req, res, next) {
    const game = req.game;

    game.scoreTeamA = !_.isUndefined(req.body.scoreTeamA) ? req.body.scoreTeamA : game.scoreTeamA;
    game.scoreTeamB = !_.isUndefined(req.body.scoreTeamB) ? req.body.scoreTeamB : game.scoreTeamB;
    game.winner = !_.isUndefined(req.body.winner) ? req.body.winner : game.winner;
    game.status = !_.isUndefined(req.body.status) ? req.body.status : game.status;


    game.saveAsync()
        .then((savedGame) => {
            notifier.send("game", savedGame);
            return res.json(savedGame)
        })
        .error((e) => next(e));
}

/**
 * Get game list.
 * @property {number} req.query.skip - Number of games to be skipped.
 * @property {number} req.query.limit - Limit number of games to be returned.
 * @returns {Game[]}
 */
function list(req, res, next) {
    const { skip = 0, limit = 61 } = req.query;
    Game.list({ limit: parseInt(limit), skip: parseInt(skip) }).then((games) =>  res.json(games))
        .error((e) => next(e));
}

export default { load, get, list, update, next};