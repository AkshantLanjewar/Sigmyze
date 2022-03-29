const redis = require('redis')
const express  = require('express')
const session = require('express-session')
const passport = require('passport')
const connectRedis = require('connect-redis')
const fs = require('fs')
const https = require('https')

async function main() {
    const app = express();
    const port = Number(process.env.PORT) || 8050;

    function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401)
    }

    const RedisStore = connectRedis(session)

    const redisClient = redis.createClient({
        host: 'localhost',
        port: 6379
    })

    redisClient.on('error', function (err) {
        console.log('Could not establish a connection with redis. ' + err);
    })

    redisClient.on('connect', function (err) {
        console.log('Connected to redis successfully');
    })

    app.use(session({
        secret: "asdkashdaksjhdaskjhdakjhdannyadksjhakjshd",
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        proxy: true,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    }))

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    app.use(passport.session()) 

    app.listen(port, () => {
        console.log('app listening on port ' + port)
    })
}

main()