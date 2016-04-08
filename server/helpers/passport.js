import { Strategy } from 'passport-local';
import User from '../models/user';

export default function(passport) {
    passport.use('local',
        new Strategy({
            'usernameField': 'email',
            'passwordField': 'password'
        }, (email, password, done) => {
            User.findByEmail({email})
            .then((err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }
                if (!user.verifyPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
        })
    );
}