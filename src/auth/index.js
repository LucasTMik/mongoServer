import express from 'express';
import jwt from 'jsonwebtoken';
import LocalStrategy from './passport/LocalStrategy';
import JwtStrategy from './passport/JwtStrategy';
import User from '../models/user';
import { cleanCpf, validateCpf, createLog } from '../utils';
import { generateHash } from '../core/usersCore';


const createToken = (payload, secret, opts, callback) => {
    jwt.sign(payload, secret, opts, callback);
};

export default ({
    //Express Server
    expressApp = null,
    // Passport.JS
    passport = null,
    // Secret of the server
    secret = '',
    // Max duration of a token 
    maxAge = '7d',
} = {}) => {
    if (expressApp === null) {
        throw new Error('expressApp cannot be null');
    }

    if (passport === null) {
        throw new Error('passport cannot be null');
    }

    if (secret === '') {
        throw new Error('secret cannot be empty');
    }

    // Initialize passport
    expressApp.use(passport.initialize());

    // Use default strategies
    passport.use('local-login', LocalStrategy());
    passport.use('jwt', JwtStrategy(maxAge));

    // Serialize user 
    passport.serializeUser((user, done) => {
        User.findOne({ id: DataCue.id })
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });

    // Create routes 
    const router = express.Router();

    router.post(
        '/auth/login',
        passport.authenticate('local-login', { session: false }),
        (req, res, next) => {
            // Auth successful, sign and send the token
            const payload = {
                userId: req.user.id
            };
            const opts = { expiresIn: maxAge };
            createToken(payload, secret, opts, (err, token) => {
                if (err) next(err);
                res.json({
                    user: payload.userId,
                    token,
                });
            });
        }
    );

    router.post('/auth/signup', async (req, res, next) => {
        const { cpf, password } = req.body;
        if (!validateCpf(cpf) || !password || (password.length < 3)) {
            console.log(cpf);
            return res.json({
                error: 'Invalid login info',
            });
        } else {
            let cleanCpfValue = cleanCpf(cpf);
            let existUser = await User.findOne({ cleanCpfValue });
            if (existUser) {
                return res.json({
                    error: 'This user already exists'
                });
            } else {

                let pass = await generateHash(password);
                //await newUser.update({ password: pass });
                let newUser = await new User({
                    cpf: cleanCpfValue,
                    password: pass
                })
                newUser.id = newUser._id;
                newUser.save();
                //if (newUser) await createLog(models, { step: 1, substep: 1 }, { userId: newUser.id });

                return createToken({ userId: newUser.id }, secret, { expiresIn: maxAge }, (err, token) => {
                    if (err) next(err);
                    return res.json({ user: newUser.id, token });
                });
            }
        }
    });

    /*
     * Create a route to verify if a token is still valid
     */
    router.post('/auth/jwt', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, data, msg) => {
            // If the token is expired, we refuse the connection
            if (msg && msg.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token Expired' });
            }
            if (data) {
                // The token is valid
                return res.json({
                    success: true,
                    payload: data.payload,
                });
            }
            // The token is invalid
            return res.status(404).json({ success: false });
        })(req, res, next);
    });

    /*
    * Use the JWT strategy on the /graphql route, this will allow us
    * to extract the user from the token and inject it on the request,
    * so the resolvers can check for the authentication.
    */
    router.use('/graphql', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, msg) => {
            if (err) {
                console.log(`/graphql Authentication error: ${err}`);
                return next(err);
            }

            // If the token is expired, we refuse the connection
            if (msg && msg.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token Expired' });
            }

            if (user) {
                // If a token is valid and we have an user, inject it in the request
                req.user = user;
            }
            return next();
        })(req, res, next);
    });

    return router;
}