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
            if(fixture.status == 'IN_PLAY')  score.status = 'IN_PROGRESS';


            // goalsHomeTeam: 0,
            // goalsAwayTeam: 0,
            // halfTime: {
            //     goalsHomeTeam: 0,
            //     goalsAwayTeam: 0
            // },
            // extraTime: {
            //     goalsHomeTeam: 0,
            //     goalsAwayTeam: 0
            // },
            // penaltyShootout: {
            //     goalsHomeTeam: 8,
            //     goalsAwayTeam: 7
            // }

            if(!_.isUndefined(fixture.result.goalsHomeTeam)) score.scoreTeamA = parseInt(fixture.result.goalsHomeTeam);
            if(!_.isUndefined(fixture.result.goalsAwayTeam)) score.scoreTeamB = parseInt(fixture.result.goalsAwayTeam);

            if(!_.isUndefined(fixture.result.extraTime)) {
                if(!_.isUndefined(fixture.result.extraTime.goalsHomeTeam)) score.scoreTeamA = parseInt(fixture.result.extraTime.goalsHomeTeam);
                if(!_.isUndefined(fixture.result.extraTime.goalsAwayTeam)) score.scoreTeamB = parseInt(fixture.result.extraTime.goalsAwayTeam);
            }

            score.resultDetails = getResultDetails(fixture.result);


            if(!_.isUndefined(score.scoreTeamA) && !_.isUndefined(score.scoreTeamB)) {
                // if((score.scoreTeamA - score.scoreTeamB) > 0) {
                //     score.winner = "teamA";
                // } else if ((score.scoreTeamA - score.scoreTeamB) < 0) {
                //     score.winner = "teamB";
                // } else {
                //     score.winner = "nobody";
                // }
                score.winner = getWinnerFromResultDetails(score.resultDetails);
            }

            console.log("fixture", fixture);
            console.log("score ?", score);
            return score;
        })
        .catch((e) => {
            console.log("error", e);
        })
}

function getResultDetails(result) {
    let resultDetails = {};
    if(!_.isUndefined(result.goalsHomeTeam)) resultDetails.scoreTeamA = result.goalsHomeTeam;
    if(!_.isUndefined(result.goalsAwayTeam)) resultDetails.scoreTeamB = result.goalsAwayTeam;

    if(result.halfTime) {
        resultDetails.halfTime = {
            scoreTeamA: result.halfTime.goalsHomeTeam,
            scoreTeamB: result.halfTime.goalsAwayTeam
        }
    }

    if(result.extraTime) {
        resultDetails.extraTime = {
            scoreTeamA: result.extraTime.goalsHomeTeam,
            scoreTeamB: result.extraTime.goalsAwayTeam
        }
    }

    if(result.penaltyShootout) {
        resultDetails.penaltyShootout = {
            scoreTeamA: result.penaltyShootout.goalsHomeTeam,
            scoreTeamB: result.penaltyShootout.goalsAwayTeam
        }
    }
    return resultDetails;
}

function getWinnerFromResultDetails(resultDetails) {
    if(resultDetails.penaltyShootout) {
        return getWinnerFromScores(resultDetails.penaltyShootout.scoreTeamA, resultDetails.penaltyShootout.scoreTeamB);
    } else if(resultDetails.extraTime) {
        return getWinnerFromScores(resultDetails.extraTime.scoreTeamA, resultDetails.extraTime.scoreTeamB)
    } else if(!_.isUndefined(resultDetails.scoreTeamA) || !_.isUndefined(resultDetails.scoreTeamB)) {
        return getWinnerFromScores(resultDetails.scoreTeamA, resultDetails.scoreTeamB)
    }
}

function getWinnerFromScores(scoreTeamA, scoreTeamB) {
    if((scoreTeamA - scoreTeamB) > 0) {
        return "teamA";
    } else if ((scoreTeamA - scoreTeamB) < 0) {
        return "teamB";
    } else {
        return "nobody";
    }
}