'use strict';

import app from '../server';
import Game from '../server/models/game';
import Prediction from '../server/models/prediction';
import User from '../server/models/user';
import _ from 'lodash';

export default function (program) {
    program
        .command('stats-global')
        .description('Get some stats')
        .action(function () {
            //console.log("update the score ...");
            Game.finished({})
                .then((games) => {
                    //console.log("######### games :", games);
                    var promises = _.map(games, (game) => {
                        return Prediction.list({limit: 200, game: game._id})
                    })
                    return Promise.all(promises);
                })
                .then(function(predictions) {
                    //console.log("result of promise", predictions);
                    var predictionsData = _.flatten(predictions)
                    var perfectCount = _.reduce(predictionsData, function(sum, prediction) {
                        if(prediction.score == 3) {
                            return sum + 1;
                        } else {
                            return sum;
                        }
                    }, 0);
                    var failCount = _.reduce(predictionsData, function(sum, prediction) {
                        if(prediction.score == 0) {
                            return sum + 1;
                        } else {
                            return sum;
                        }
                    }, 0);
                    var winnerCount = _.reduce(predictionsData, function(sum, prediction) {
                        if(prediction.score > 0) {
                            return sum + 1;
                        } else {
                            return sum;
                        }
                    }, 0);
                    var points = _.reduce(predictionsData, function(sum, prediction) {
                        return sum + prediction.score;
                    }, 0);
                    console.log("Nombre de pronos : ", predictionsData.length);
                    console.log("Nombre de 3 points : %s (%s %)", perfectCount, (perfectCount/predictionsData.length*100).toFixed(0));
                    console.log("Nombre de 0 points : %s (%s %)", failCount, (failCount/predictionsData.length*100).toFixed(0));
                    console.log("Nombre de bons résultats (mais pas le score) : %s (%s %)", winnerCount, (winnerCount/predictionsData.length*100).toFixed(0));
                })
                .then(function() {
                    
                    process.exit(0);
                })
                .catch(function(e) {
                    console.log("error in update of the score", e);
                    process.exit(1);
                })
        });
};