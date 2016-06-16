import program from 'commander';
import updateScore from './update-score';
import updateUsers from './update-users';

import test from './test';

updateScore(program);
updateUsers(program);
test(program);

program
    .command('*')
    .action(function () {
        console.error('It doesn\'t work like this ...');
        process.exit(1);
    });

module.exports = {
    run (argv) {
        program.parse(argv);
        if (!program.args.length) program.help();
    }
};

