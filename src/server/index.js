const redis = require('redis')
const express  = require('express')
const session = require('express-session')
const passport = require('passport')
const connectRedis = require('connect-redis')

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
    resave: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(passport.initialize())
app.use(passport.session())

const userRouter = require('./user/index')
app.use('/user', userRouter.userRouter())

process.env.NODE_ENV = "dev"

if(process.env.NODE_ENV == "dev") {
    console.log(process.env.NODE_ENV)

    app.get('*.js', (req, res, next) => {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        res.set('Content-Type', 'application/javascript; charset=UTF-8')
        next()
    })

    app.use(express.static('dist', { root: '.' })); 
    app.use(express.static('static', {root: '.'}))
}

const dataRouter = require('./data/index')
app.use('/api/data', dataRouter.dataRouter())


app.get(`/**`, (req, res) => {
    res.sendFile('/dist/index.html', { root: '.' })
})


app.listen(port, () => {
    console.log('app listening on port ' + port)
})