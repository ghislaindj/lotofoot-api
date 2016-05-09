import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', (error) => {
    throw new Error(`unable to connect to database: ${config.db} - ${error}`);
});

const debug = require('debug')('lotofoot-api:index');

// listen on port config.port
const server = app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
});

let io = require('socket.io')({
    transports: [ 'xhr-polling' ],
    pollingDuration: 10,
}).listen(server);


io.on('connection', (socket) => {
  console.log('a user connected');

  var ping = setInterval(function () {
    socket.volatile.emit('ping', 'ping');
  }, 10000);
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export default app