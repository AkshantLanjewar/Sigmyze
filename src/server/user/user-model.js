const crypto = require('crypto')
const mysql = require('mysql2/promise')
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
        CREATE TABLE IF NOT EXISTS Users (
            provider    nvarchar(128)  NOT NULL,
            username    nvarchar(320)  NOT NULL,
            provider_id nvarchar(1024) NOT NULL,
            image       nvarchar(1024),
            email       nvarchar(320)  NOT NULL,
            sig_id      nvarchar(512)  NOT NULL UNIQUE,
            firstname   nvarchar(320)  NOT NULL,
            lastname    nvarchar(320)  NOT NULL,
            password    BLOB,
            salt        BLOB,
            verified    BOOLEAN, 
            accPin      nvarchar(256),
            CONSTRAINT  PK_User PRIMARY KEY (username, sig_id)
        )
    `

    await db.query(query)
    await db.end()
}

async function LookupUser(params) {
    const db = await conn()
    await db.query('use Sigmyze;')
    let query = ``

    const email       = params.email
    const sig_id      = params.sig_id
    const provider    = params.provider
    const provider_id = params.provider_id

    if(email !== undefined)
        query = `SELECT * FROM Users WHERE email='${email}' LIMIT 1`
    if(sig_id !== undefined)
        query = `SELECT * FROM Users WHERE sig_id='${sig_id}' LIMIT 1`
    if(provider == 'sigmyze' && email !== undefined)
        query = `SELECT * FROM Users WHERE provider='sigmyze' AND email='${email}'`
    if(provider == 'fb' && provider_id !== undefined)
        query = `SELECT * FROM Users WHERE provider='facebook' AND provider_id='${provider_id}`
    if(provider == 'google' && provider_id !== undefined)
        query = `SELECT * FROM Users WHERE provider='google' AND provider_id='${provider_id}'`

    let [rows, fields] = await db.query(query)
    await db.end()
    return [rows, fields]
}

async function VerifySigmyzeUser(sig_id) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `
        UPDATE users SET verified = 1 WHERE sig_id = '${sig_id}'
    `

    await db.query(query)
    await db.end()
}

async function UpdateSigmyzeUserPWD(sig_id, n_pwd) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let salt     = crypto.randomBytes(16).toString('hex')
    let password =  crypto.pbkdf2Sync(n_pwd, salt, 310000, 32, 'sha512').toString('hex')
    let query    = `
        UPDATE users SET salt = '${salt}', password = '${password}' WHERE sig_id = '${sig_id}'
    ` 

    await db.query(query)
    await db.end()
}

async function CreateSigmyzeUser(sig_object) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let cTimeSTR = getCurrTime()
    let provider_id_str = `${sig_object['email']}-${cTimeSTR}`
    let provider_id = crypto.createHash('sha512').update(provider_id_str, 'utf-8').digest('hex')
    let username = sig_object['firstname'] + sig_object['lastname']
    let email = sig_object['email']

    //hash the password
    let password_r = sig_object['password']
    let salt       = crypto.randomBytes(16).toString('hex')
    let password   = crypto.pbkdf2Sync(password_r, salt, 310000, 32, 'sha512').toString('hex')

    let accPinSTR = `${cTimeSTR}-${username}`
    let pin = crypto.pbkdf2Sync(accPinSTR, salt, 310000, 32, 'sha256').toString('hex')

    //create the sig_id
    let sig_id_prehash = `sigmyze-${provider_id}-${username}-${email}`
    let sig_id = crypto.createHash('sha512').update(sig_id_prehash, 'utf-8').digest('hex')
    let query = `
        INSERT INTO Users (provider, username, provider_id, email, sig_id, firstname, lastname, password, salt, verified, accPin)
        VALUES ('sigmyze', '${username}', '${provider_id}', '${email}', '${sig_id}',
                '${sig_object['firstname']}', '${sig_object['lastname']}', '${password}', '${salt}', 0, '${pin}')
    `

    mailer.VerificationEmail(pin, email)

    await db.query(query)
    await db.end()
    return sig_id
}

async function CreateFacebookUser(fb_object) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let provider = 'facebook'
    let provider_id = fb_object['id']
    let username = fb_object['name']['givenName'] + fb_object['name']['familyName']
    let image = fb_object['photos'][0].value
    let email = fb_object['emails'][0].value

    //hash out the sig_id
    let sig_id_prehash = `${provider}-${provider_id}-${username}-${email}`
    let hash = crypto.createHash('sha512')
    let sig_id = hash.update(sig_id_prehash, 'utf-8').digest('hex') 

    let query = `
        INSERT INTO Users (provider, username, provider_id, image, email, sig_id, firstname, lastname)
        VALUES ('${provider}', '${username}', '${provider_id}', '${image}', '${email}', 
                '${sig_id}', '${fb_object['name']['givenName']}', '${fb_object['name']['familyName']}')
    `

    await db.query(query)
    await db.end()
    return sig_id
}

async function CreateGoogleUser(google_object) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let provider    = 'google'
    let provider_id = google_object['id']
    let username = google_object['displayName']
    let image = google_object['picture']
    let email = google_object['email']

    //hash out a sig_id
    let sig_id_prehash = `${provider}-${provider_id}-${username}-${email}`
    let hash = crypto.createHash('sha512')
    let sig_id = hash.update(sig_id_prehash, 'utf-8').digest('hex')

    
    let query = `
        INSERT INTO Users (provider, username, provider_id, image, email, sig_id, firstname, lastname)
        VALUES ('${provider}', '${username}', '${provider_id}', '${image}', '${email}', 
                '${sig_id}', '${google_object['given_name']}', '${google_object['family_name']}')
    `

    await db.query(query)
    await db.end()
    return sig_id
}

exports.SetupTable = SetupTable
exports.CreateGoogleUser = CreateGoogleUser
exports.CreateFacebookUser = CreateFacebookUser
exports.LookupUser = LookupUser
exports.CreateSigmyzeUser = CreateSigmyzeUser
exports.VerifySigmyzeUser = VerifySigmyzeUser
exports.UpdateSigmyzeUserPWD = UpdateSigmyzeUserPWD