import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import config from '../../config/env';
import _ from 'lodash';

Promise.promisifyAll(request);

export default function(game) {
    if(!game.footDbUrl) return Promise.resolve();

    return request
        .get(game.footDbUrl)
        .set('X-Auth-Token', config.footballDataKey)
        .then((response) => {
            const { body: {fixture} } = response;
            let score = {};

            if(fixture.status == 'FINISHED') score.status = 'FINISHED';

            if(!_.isUndefined(fixture.result.goalsHomeTeam)) score.scoreTeamA = parseInt(fixture.result.goalsHomeTeam);
            if(!_.isUndefined(fixture.result.goalsAwayTeam)) score.scoreTeamB = parseInt(fixture.result.goalsAwayTeam);

            if(!_.isUndefined(score.scoreTeamA) && !_.isUndefined(score.scoreTeamB)) {
                if((score.scoreTeamA - score.scoreTeamB) > 0) {
                    score.winner = "teamA";
                } else if ((score.scoreTeamA - score.scoreTeamB) < 0) {
                    score.winner = "teamB";
                } else {
                    score.winner = "nobody";
                }
            }
            console.log("fixture", fixture);
            console.log("score ?", score);
            return score;
        })
        .catch((e) => {
            console.log("error", e);
        })
}