const express  = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')

const mongoose = require('mongoose')

mongoose
    .connect("mongodb://localhost:27017/lunar", { useNewUrlParser: true })
    .then(() => {
        const app = express();
        const port = Number(process.env.PORT) || 8050;

        function isLoggedIn(req, res, next) {
            req.user ? next() : res.sendStatus(401)
        }

        app.use(express.static('dist', { root: '.' })); 

        app.use(session({ secret: 'big yolo danny' }))
        app.use(passport.initialize())
        app.use(passport.session())

        const userRouter = require('./user/index')
        app.use('/user', userRouter.userRouter())

        app.get(`/`, (req, res) => {
            res.sendFile('/dist/index.html', { root: '.' })
        })

        app.get(`/buisness`, (req, res) => {
            res.sendFile('/dist/index.html', { root: '.' })
        })

        app.listen(port, () => {
            console.log('app listening on port ' + port)
        })
    })