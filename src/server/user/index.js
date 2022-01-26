const Router = require('express').Router
const fs = require('fs')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const FacebookStrategy = require('passport-facebook')

const User = require('./user-model')
const crypto = require('crypto')

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
            profile['verified'] = true
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
            profile['verified'] = true
            return done(null, profile)
        }
    ))

    router.post('/verify', async(req, res) => {
        if(!req.user)
            return res.json({ error: false, message: "unlog" })
        
        const sig_id   = req.user.sig_id
        const ver_code = req.body.ver_code

        let [users, fields] = await User.LookupUserSigid(sig_id)
        let user = users[0]
        let pin  = user.accPin

        if(user.verified == 1)
            return res.json({ error: false, message: '' })
        if(pin !== ver_code)
            return res.json({ error: true, message: "bad_code" })

        await User.VerifySigmyzeUser(sig_id)
        req.user.verified = true
        return res.json({ error: false, message: '' })
    })

    router.post('/login', async(req, res) => {
        const email = req.body.email
        const password = req.body.password

        let sigobj = { email: email, password: password }
        let [userRows, fields] = await User.LookupUserSigmyze(sigobj)
        if(userRows.length == 0)
            return res.json({ message: 'dn_exists', error: true })
        
        let user = userRows[0]
        let hash = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha512').toString('hex')
        if(!(hash == user.password))
            return res.json({ message: 'bad_pw', error: true })
        
        let userOBJ = {
            sig_id: user.sig_id,
            email: email,
            verified: user.verified
        }

        req.login(userOBJ, function(err) {
            if(err) return res.json({ message: err, error: true })
            return res.json({ error: false, message: "" })
        })
    })

    router.post('/signup', async (req, res) => {
        const email = req.body.email
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const password = req.body.password

        let sigobj = { email: email, firstname: firstname, lastname: lastname, password: password }
        let [rows, fields] = await User.LookupUserSigmyze(sigobj)
        if(rows.length !== 0)
            return res.json({ message: 'exists', error: true })
        let sig_id = await User.CreateSigmyzeUser(sigobj)
        
        let user = {
            sig_id: sig_id,
            email: email,
            verified: false
        }

        req.login(user, function(err) {
            if(err) return res.json({ message: err, error: true })
            return res.json({ message: 'pin', error: false })
        })
    })

    router.get('/failed', (req, res) => {
        res.redirect('/')
    })

    router.get('/success', (req, res) => {
        res.redirect('/')
    })

    router.get('/isLoggedIn', (req, res) => {
        if(req.user)
            return res.json({ logged: true, verified: req.user.verified })
        else
            return res.json({ logged: false, verified: null })
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