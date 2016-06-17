'use strict';

import app from '../server';
import Game from '../server/models/game';
import Prediction from '../server/models/prediction';
import _ from 'lodash';

export default function (program) {
    program
        .command('update-game <friendlyId>')
        .description('Update the score of a game.')
        .action(function (friendlyId) {
            console.log("update the score ... of %s", friendlyId);
            Game.getByFriendlyId(friendlyId)
                .then((game) => {
                    console.log("######### game :", game);
                    return game.updateScoreFromFootDb();
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