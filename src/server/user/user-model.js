const db = require('../db')

//db tables
//username : string : nvarchar(320)
//provider : string : nvarchar(128)
//provider_id: string : nvarchar(1024)
//image: string : nvarchar(1024)
//email: string : nvarchar(320)
//sig_id: string : nvarchar(512)

async function SetupTable() {
    let query = `
        CREATE TABLE IF NOT EXISTS Users (
            provider    nvarchar(128)  NOT NULL,
            username    nvarchar(320)  NOT NULL,
            provider_id nvarchar(1024) NOT NULL,
            image       nvarchar(1024),
            email       nvarchar(320)  NOT NULL,
            sig_id      nvarchar(320)  NOT NULL,
            CONSTRAINT  PK_User PRIMARY KEY (username, sig_id, provider_id)
        ) IF NOT EXISTS
    `

    await db.query(query)
}

async function LookupUser(provider, provider_id) {
    let query = `
        SELECT * FROM Users WHERE provider='${provider}' AND provider_id='${provider_id}'
    `
    
    return await db.query(query)
}

exports.SetupTable = SetupTable