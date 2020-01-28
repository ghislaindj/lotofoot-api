import Team from '../models/team';

/**
 * Load team and append to req.
 */
function load(req, res, next, id) {
    Team.get(id).then((team) => {
        req.team = team;
        return next();
    }).error((e) => next(e));
}

/**
 * Get team
 * @returns {Team}
 */
function get(req, res) {
    return res.json(req.team);
}

/**
 * Get team list.
 * @property {number} req.query.skip - Number of teams to be skipped.
 * @property {number} req.query.limit - Limit number of teams to be returned.
 * @returns {Team[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Team.list({ limit: parseInt(limit), skip: parseInt(skip) }).then((teams) =>  res.json(teams))
        .error((e) => next(e));
}

export default { load, get, list};
