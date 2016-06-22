'use strict';

import app from '../server';
import Game from '../server/models/game';
import Prediction from '../server/models/prediction';
import _ from 'lodash';

export default function (program) {
    program
        .command('update-all')
        .description('Update everything')
        .action(function () {
            console.log("update everything");
            Game.list({})
                .then((games) => {
                    console.log("######### games :", games);
                    return _.reduce(games, (p, game) => {
                            return p.then(() => {
                                setTimeout(() => {
                                    console.log("##### GAME %s #####", game.friendlyId);
                                    game.updateScoreFromFootDb()
                                }, 5000); 
                            })
                        },
                        Promise.resolve()
                    )
                })
                .then(function(result) {
                    console.log("result of promise", result);
                    setTimeout(() => process.exit(0), 20000); 
                })
                .catch(function(e) {
                    console.log("error in update of the score", e);
                    process.exit(1);
                })
        });
};