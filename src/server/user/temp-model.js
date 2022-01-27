const mysql = require('mysql2/promise')

async function conn() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
    })
    
    let db_createstr = `CREATE DATABASE IF NOT EXISTS Sigmyze;` 
    await connection.query(db_createstr)
    return connection
}

async function SetupTable() {
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `
        CREATE TABLE IF NOT EXISTS ExpiryQuery(
            DateCreated DATETIME       NOT NULL DEFAULT(GETDATE()),
            LastTime    INT            NOT NULL,
            sig_id      nvarchar(512)  NOT NULL,
            request     nvarchar(512)  NOT NULL
        )
    `

    await db.query(query)
    await db.end()
}

exports.SetupTable = SetupTable