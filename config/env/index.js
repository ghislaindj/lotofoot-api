import path from 'path';
import _ from 'lodash';

const config = {
    root: path.join(__dirname, '/..'),
    db: process.env.MONGO_URL,
    port: process.env.PORT
};

export default config;