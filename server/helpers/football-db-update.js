import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import config from '../../config/env';

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

            if(fixture.result.goalsHomeTeam) score.scoreTeamA = parseInt(fixture.result.goalsHomeTeam);
            if(fixture.result.goalsAwayTeam) score.scoreTeamB = parseInt(fixture.result.goalsAwayTeam);

            if(score.scoreTeamA && score.scoreTeamB) {
                if((score.scoreTeamA - score.scoreTeamB) > 0) {
                    score.winner = "teamA";
                } else if ((score.scoreTeamA - score.scoreTeamB) < 0) {
                    score.winner = "teamB";
                } else {
                    score.winner = "nobody";
                }
            }

            return score;
        })
        .catch((e) => {
            console.log("error", e);
        })
}