const express  = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path') 

const mongoose = require('mongoose')

const app = express();
const port = Number(process.env.PORT) || 8050;

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401)
}

//app.use(express.static('dist', { root: '.' })); 

//app.use(session({ secret: 'big yolo danny' }))
//app.use(passport.initialize())
//app.use(passport.session())

//const userRouter = require('./user/index')
//app.use('/user', userRouter.userRouter())

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

const blogRouter = require('./blog')
app.use('/api/blog', blogRouter.blogRouter())


app.get(`/**`, (req, res) => {
    res.sendFile('/dist/index.html', { root: '.' })
})


app.listen(port, () => {
    console.log('app listening on port ' + port)
})