const nodemailer = require('nodemailer')

function VerificationEmail(code) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'sigmyze@gmail.com',
            pass: 'MpwdfSi-Lunar@123'
        }
    })

    transporter.verify()
}

exports.VerificationEmail = VerificationEmail