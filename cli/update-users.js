'use strict';

import app from '../server';
import User from '../server/models/user';
import _ from 'lodash';

export default function (program) {
    program
        .command('update-users')
        .description('Update the users.')
        .action(function () {
            console.log("update the users ...");
            User.list({limit: 200})
                .then((users) => {
                    console.log("######### users :", users.length);
                    var promises = _.map(users, (user) => {
                        return user.saveAsync();
                    })
                    return Promise.all(promises)
                })
                .then(function(result) {
                    console.log("result of promise", result);
                    setTimeout(() => process.exit(0), 20000); 
                })
                .catch(function(e) {
                    console.log("error in update of the users", e);
                    process.exit(1);
                })
        });
};