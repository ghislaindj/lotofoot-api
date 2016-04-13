'use strict';

export default function (program) {
    program
        .command('test')
        .description('Test')
        .action(function () {
            console.log("test in progress");
            process.exit(0);
        });
};