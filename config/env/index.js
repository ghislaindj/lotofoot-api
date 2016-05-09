import path from 'path';
import _ from 'lodash';

const config = {
    root: path.join(__dirname, '/..'),
    db: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET_TOKEN,
    expiresIn: 3600 * 24 * 14,
    footballDataKey: process.env.FOOTBALL_DATA_KEY,
    mailer: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        port: process.env.SMTP_PORT,
        host: process.env.SMTP_HOST,
        defaultFromAddress: '⚽️ Team Lotofoot ⚽️<hello@lotofoot.radio97.fr>',
        defaultBcc: process.env.EMAIL_BCC,
        prefix: process.env.EMAIL_PREFIX || ''
    },
    webUrl: process.env.WEB_URL
};

export default config;