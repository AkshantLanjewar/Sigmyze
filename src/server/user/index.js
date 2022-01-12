const Router = require('express').Router
const fs = require('fs')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const FacebookStrategy = require('passport-facebook')

const User = require('./user-model')

function userRouter() {
    User.SetupTable()
    const router = Router();

    const keys   = JSON.parse(fs.readFileSync(__dirname + '\\..\\..\\keys\\google_keys.json'))
    const fbKeys = JSON.parse(fs.readFileSync(__dirname + '\\..\\..\\keys\\facebook_keys.json')) 
    
    passport.serializeUser(async function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(async function(user, done) {
        done(null, user)
    })

    passport.use(new GoogleStrategy({
            "clientID": keys['web']['client_id'],
            "clientSecret": keys['web']['client_secret'],
            "callbackURL": '/user/google/callback',
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    ))

    passport.use(new FacebookStrategy({
            clientID: fbKeys['appID'],
            clientSecret: fbKeys['appSecret'],
            callbackURL: "/user/fb/callback"
        },

        function(accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    ))

    router.get('/failed', (req, res) => {
        res.redirect('/')
    })

    router.get('/success', (req, res) => {
        res.redirect('/')
    })

    router.get('/isLoggedIn', (req, res) => {
        return req.user ? res.json(true) : res.json(false)
    })

    router.get('/logout', (req, res) => {
        req.logout()
        
        return res.json(true)
    })

    router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
    router.get('/fb', passport.authenticate('facebook'))

    router.get('/fb/callback', passport.authenticate('facebook', {
        failureRedirect: '/user/failed'
        }),
        function(req, res) {
            res.redirect('/')
        }
    )

    router.get('/google/callback', passport.authenticate('google', {
            failureRedirect: '/user/failed'
        }),
        function(req, res) {
            res.redirect('/')
        }
    )

    return router;
}

exports.userRouter = userRouter