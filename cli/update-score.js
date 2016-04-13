'use strict';

import app from '../server';
import Game from '../server/models/game';
import _ from 'lodash';

export default function (program) {
    program
        .command('update-score')
        .description('Update the score of games.')
        .action(function () {
            console.log("update the score ...");
            Game.today({})
                .then((games) => {
                    var promises = _.map(games, (game) => {
                        return game.updateScoreFromFootDb();
                    })
                    return Promise.all(promises)
                })
                .then(function() {
                    process.exit(0);
                })
                .catch(function(e) {
                    console.log("error", e);
                    process.exit(1);
                })
        });
};