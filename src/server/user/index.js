const Router = require('express').Router
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('./user-model')

function userRouter() {
    const router = Router();
    const GOOGLE_CLIENT_ID = "566324925606-4oornr2dq44h84ikoiv8fl7hg8snknla.apps.googleusercontent.com"
    const GOOGLE_CLIENT_SECRET = "1N6glJWPL1qH7tLrcwiOr237"

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8050/user/auth/google/callback",
            passReqToCallback: true
        },
        async function(request, accessToken, refreshToken, profile, done) {
            const provider    = profile.provider
            const id          = profile.id
            const displayname = profile.displayName
            const email       = profile.email

            const tUserEMAIL = await User.findOne({o_id: id, provider: provider, email: email}, 'email')
            if(tUserEMAIL == null)
            {
                const user = new User({
                    email: email,
                    provider: provider,
                    o_id: id,
                    displayname: displayname
                })

                await user.save()
            }

            return done(null, profile)
        }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })

    router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/buisness',
        failureRedirect: '/user/auth/google/failure'
    }))

    router.get('/auth/google/failure', (req, res) => {
        res.send("Failed to Login")
    })

    router.get('/isLoggedin', (req, res) => {
        req.user ? res.send("loggedin") : res.send("logout")
    })

    router.get('/logout', (req, res) => {
        req.logout()
        req.session.destroy()
        res.send('logout')
    })

    return router;
}

exports.userRouter = userRouter