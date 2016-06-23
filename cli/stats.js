'use strict';

import app from '../server';
import Game from '../server/models/game';
import Prediction from '../server/models/prediction';
import User from '../server/models/user';
import _ from 'lodash';

export default function (program) {
    program
        .command('stats')
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
                    var test = _.groupBy(_.flatten(predictions), 'user');
                    //console.log("test", _.keys(test));
                    // _.map(test, (userPredictions, user) => {
                    //     console.log("user %s has %s predictions", user, userPredictions.length);
                    // });
                    var promises = _.map(test, (userPredictions, user) => {
                        return Promise.all([
                            User.get(user),
                            userPredictions
                        ]);
                    })
                    return Promise.all(promises);
                })
                .then(function(results) {
                    console.log("email, firstName, lastName, perfectCount, failCount, winnerCount, points");
                    _.map(results, (result) => {
                        var user = result[0];
                        var userPredictions = result[1];

                        var perfectCount = _.reduce(userPredictions, function(sum, prediction) {
                            if(prediction.score == 3) {
                                return sum + 1;
                            } else {
                                return sum;
                            }
                        }, 0);
                        var failCount = _.reduce(userPredictions, function(sum, prediction) {
                            if(prediction.score == 0) {
                                return sum + 1;
                            } else {
                                return sum;
                            }
                        }, 0);
                        var winnerCount = _.reduce(userPredictions, function(sum, prediction) {
                            if(prediction.score > 0) {
                                return sum + 1;
                            } else {
                                return sum;
                            }
                        }, 0);
                        var points = _.reduce(userPredictions, function(sum, prediction) {
                            return sum + prediction.score;
                        }, 0);
                        // console.log("%s %s :", user.firstName, user.lastName);
                        // console.log("Nombre de 3 points : %s", perfectCount);
                        // console.log("Nombre de 0 points : %s", failCount);
                        // console.log("Nombre de bons résultats (mais pas le score) : %s", winnerCount);
                        console.log("%s, %s, %s, %s, %s, %s,", user.email, user.firstName, user.lastName, perfectCount, failCount, winnerCount, points);
                    });
                    process.exit(0);
                })
                .catch(function(e) {
                    console.log("error in update of the score", e);
                    process.exit(1);
                })
        });
};