const crypto = require('crypto')
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
        CREATE TABLE IF NOT EXISTS Users (
            provider    nvarchar(128)  NOT NULL,
            username    nvarchar(320)  NOT NULL,
            provider_id nvarchar(1024) NOT NULL,
            image       nvarchar(1024),
            email       nvarchar(320)  NOT NULL,
            sig_id      nvarchar(512)  NOT NULL UNIQUE,
            firstname   nvarchar(320)  NOT NULL,
            lastname    nvarchar(320)  NOT NULL,
            CONSTRAINT  PK_User PRIMARY KEY (username, sig_id)
        )
    `

    await db.query(query)
    await db.end()
}

async function LookupUserSigid(sig_id) {
    const db = await conn()
    await db.query('use Sigmyze;')

    let query = `
        SELECT * FROM Users WHERE sig_id='${sig_id}' LIMIT 1
    `

    let [rows, fields] = await db.query(query)
    await db.end()
    return [rows, fields]
}

async function LookupUserFacebook(fb_object) {
    const db = await conn()
    await db.query('use Sigmyze;')
    let provider_id = fb_object['id']

    let query = `
        SELECT * FROM Users WHERE provider='facebook' AND provider_id='${provider_id}'
    `
    let [rows, fields] = await db.query(query)
    await db.end()
    return [rows, fields]
}

async function LookupUserGoogle(google_object) {
    const db = await conn()
    await db.query('use Sigmyze;')
    let provider_id = google_object['id']

    let query = `
        SELECT * FROM Users WHERE provider='google' AND provider_id='${provider_id}'
    `
    let [rows, fields] = await db.query(query)
    await db.end()
    return [rows, fields]
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
exports.LookupUserGoogle = LookupUserGoogle
exports.CreateGoogleUser = CreateGoogleUser

exports.LookupUserFacebook = LookupUserFacebook
exports.CreateFacebookUser = CreateFacebookUser

exports.LookupUserSigid = LookupUserSigid