import path from 'path';
import _ from 'lodash';

const config = {
    root: path.join(__dirname, '/..'),
    db: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET_TOKEN,
    footballDataKey: process.env.FOOTBALL_DATA_KEY
};

export default config;