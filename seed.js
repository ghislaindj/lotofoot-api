import mongoose from 'mongoose';
import config from './config/env';
import seeder from 'mongoose-seeder';
import data from './server/seed/data.json';
import Game from './server/models/game';
import Team from './server/models/team';

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', (error) => {
    throw new Error(`unable to connect to database: ${config.db} - ${error}`);
});

mongoose.connection.on('connected', function() {
    console.log("connected");
    seeder.seed(data, {dropDatabase: false, dropCollections: true}).then(function(dbData) {
        console.log('Successfully seeded.', dbData);
        process.exit(0);
    }).catch(function(err) {
        console.log('Failed to seed :', error);
        process.exit(1);
    });
});