const db = require('../db')
const crypto = require('crypto')

async function SetupTable() {
    db.query('use Sigmyze;')

    let query = `
        CREATE TABLE IF NOT EXISTS Users (
            provider    nvarchar(128)  NOT NULL,
            username    nvarchar(320)  NOT NULL,
            provider_id nvarchar(1024) NOT NULL,
            image       nvarchar(1024),
            email       nvarchar(320)  NOT NULL,
            sig_id      nvarchar(512)  NOT NULL UNIQUE,
            CONSTRAINT  PK_User PRIMARY KEY (username, sig_id)
        )
    `

    db.query(query)
}

async function LookupUserFacebook(fb_object) {
    let provider_id = fb_object['id']

    let query = `
        SELECT * FROM Users WHERE provider='facebook' AND provider_id='${provider_id}'
    `

    return await db.query(query)
}

async function LookupUserGoogle(google_object) {
    let provider_id = google_object['id']

    let query = `
        SELECT * FROM Users WHERE provider='google' AND provider_id='${provider_id}'
    `
    
    return await db.query(query)
}

async function CreateFacebookUser(fb_object) {
    let provider = 'facebook'
    let provider_id = fb_object['id']
    let username = fb_object['name']['givenName'] + fb_object['name']['familyName']
    let image = fb_object['photos'][0].value
    let email = fb_object['emails'][0].value

    //hash out the sig_id
    let sig_id_prehash = `${provider}-${provider_id}-${username}`
    let hash = crypto.createHash('sha512')
    let sig_id = hash.update(sig_id_prehash, 'utf-8').digest('hex') 

    let query = `
        INSERT INTO Users (provider, username, provider_id, image, email, sig_id)
        VALUES ('${provider}', '${username}', '${provider_id}', '${image}', '${email}', '${sig_id}')
    `

    await db.query(query)
}

async function CreateGoogleUser(google_object) {
    let provider    = 'google'
    let provider_id = google_object['id']
    let username = google_object['displayName']
    let image = google_object['picture']
    let email = google_object['email']

    //hash out a sig_id
    let sig_id_prehash = `${provider}-${provider_id}-${username}`
    let hash = crypto.createHash('sha512')
    let sig_id = hash.update(sig_id_prehash, 'utf-8').digest('hex')

    
    let query = `
        INSERT INTO Users (provider, username, provider_id, image, email, sig_id)
        VALUES ('${provider}', '${username}', '${provider_id}', '${image}', '${email}', '${sig_id}')
    `

    await db.query(query)
}

exports.SetupTable = SetupTable
exports.LookupUserGoogle = LookupUserGoogle
exports.CreateGoogleUser = CreateGoogleUser