const mongoose = require('mongoose')

const schema = mongoose.Schema({
    provider: String,
    email: String,
    displayname: String,
    o_id: String
})

module.exports = mongoose.model("User", schema)