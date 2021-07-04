const express = require('express')

const app = express()

const user_management = require('./user_management')

app.get('/', (req, res) => {
    res.json({status: "working"})
})

app.use('/user', user_management)

app.listen(3001)