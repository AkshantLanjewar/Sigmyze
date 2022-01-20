const Router = require('express').Router
const fs = require('fs')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const FacebookStrategy = require('passport-facebook')
const LocalStrategy = require('passport-local').Strategy

const User = require('./user-model')

function isAuthenticated(req, res, next) {
    if(req.user)
        return next()
    
    return res.json({action: "unlog"})
}

async function userRouter() {
    await User.SetupTable()
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
            "callbackURL": 'https://localhost:8050/user/google/callback',
            passReqToCallback: true
        },
        async function(request, accessToken, refreshToken, profile, done) {
            let [rows, fields] = await User.LookupUserGoogle(profile)
            let sig_id = '' 
            if(rows.length == 0)
                sig_id = await User.CreateGoogleUser(profile)
            else
                sig_id = rows[0]['sig_id']

            profile['sig_id'] = sig_id
            return done(null, profile)
        }
    ))

    passport.use(new FacebookStrategy({
            clientID: fbKeys['appID'],
            clientSecret: fbKeys['appSecret'],
            callbackURL: "https://localhost:8050/user/fb/callback",
            profileFields: ['id', 'emails', 'name', 'photos']
        },

        async function(accessToken, refreshToken, profile, done) {
            let [rows, fields] = await User.LookupUserFacebook(profile)
            let sig_id = ''
            if(rows.length == 0)
                sig_id = await User.CreateFacebookUser(profile)
            else
                sig_id = rows[0]['sig_id']

            profile['sig_id'] = sig_id
            return done(null, profile)
        }
    ))

    passport.use(new LocalStrategy(async function verify(email, password, profile, cb) {
        let sigobj = { email: email }
        let [rows, fields] = await User.LookupUserSigmyze(sigobj)
        let sig_id = ''

        if(rows.length == 0) {
            sigobj['password'] = password
            sig_id = await User.CreateSigmyzeUser(sigobj)
        }
    }))

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
    router.get('/fb', passport.authenticate('facebook', { scope: ['email'] }))

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

    //user profile function
    router.get('/profile', isAuthenticated, async function(req, res) {
        let sig_id = req.user.sig_id
        let [rows, fields] = await User.LookupUserSigid(sig_id)
        let row = rows[0]

        let package = {
            firstname: row['firstname'],
            lastname: row['lastname'],
            image: row['image'],
            action: "continue"
        }

        return res.send(package)
    })

    return router;
}

exports.userRouter = userRouter