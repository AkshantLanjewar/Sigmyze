const mysql = require('mysql2/promise')
const crypto = require('crypto')
const mailer = require('../mailer')

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

function getCurrTime() {
    var currentDate = new Date().toLocaleDateString()
    var currentTime = new Date().toLocaleTimeString()
    return `${currentDate} - ${currentTime}`
}

async function SetupTable() {
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `
        CREATE TABLE IF NOT EXISTS ExpiryQuery(
            timestamp   datetime       NOT NULL,
            sig_id      nvarchar(512)  NOT NULL,
            request     nvarchar(512)  NOT NULL,
            code        nvarchar(256)  NOT NULL,
            CONSTRAINT  PK_User PRIMARY KEY (request, sig_id)
        )
    `

    await db.query(query)
    await db.end()
}

async function DeleteCodes() { 
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `delete from ExpiryQuery where timestamp < (NOW() - INTERVAL 10 MINUTE)`
    await db.query(query)
    await db.end()
}

async function FindQuery(sig_id, request) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `
        SELECT * FROM ExpiryQuery WHERE sig_id = '${sig_id}' AND request = '${request}'
    `

    let [rows, fields] = await db.query(query)
    await db.end()
    return [rows, fields]
}

async function CreateRecovery(sig_id, email) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let pinStr = `${getCurrTime()}-10-recovery-${sig_id}`
    let salt   = crypto.randomBytes(16).toString('hex')
    let pin    = crypto.pbkdf2Sync(pinStr, salt, 310000, 32, 'sha256').toString('hex')

    let query = `
        INSERT INTO ExpiryQuery (timestamp, sig_id, request, code)
        VALUES (now(), '${sig_id}', 'pwd_recovery', '${pin}')
    `

    mailer.RecoveryEmail(pin, email)

    await db.query(query)
    await db.end()
}

exports.SetupTable = SetupTable
exports.CreateRecovery = CreateRecovery
exports.FindQuery = FindQuery
exports.DeleteCodes    = DeleteCodes