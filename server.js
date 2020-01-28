import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { useNewUrlParser: true })
    .then((data) => {
        console.log('Mongo success ' + config.db);
    }, (err) => {
        console.log('Mongo error ' + config.db + ' - ' + err);
    });

const debug = require('debug')('lotofoot-api:index');

// listen on port config.port
app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
});

export default app;