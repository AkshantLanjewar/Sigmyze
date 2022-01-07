const mysql = require('mysql2')
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
})

connection.connect(function(err) {
    if(err) throw err
    
    let db_createstr = `CREATE DATABASE IF NOT EXISTS Sigmyze;` 

    connection.query(db_createstr, function(err, result) {
        if(err) throw err
    })
})

module.exports = connection