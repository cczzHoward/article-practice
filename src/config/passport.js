const {Strategy: JWTStrategy, ExtractJwt} = require('passport-jwt');
const UserModel = require('../models/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

module.exports = (passport) => {
    passport.use(
        new JWTStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await UserModel.findById(jwt_payload.id);
                if (user) {
                    const returnedUser = {
                        id: user._id,
                        username: user.username,
                    }
                    return done(null, returnedUser);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    )
};