const nodemailer = require('nodemailer')

function GetTransporter() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'sigmyze@gmail.com',
            pass: 'MpwdfSi-Lunar@123'
        }
    })

    return transporter
}

function VerificationEmail(code, email) {
    const transporter = GetTransporter()
    let message = {
        from: "sigmyze@gmail.com",
        to: email,
        subject: "Sigmyze Verification",
        html: `<h1>Thank you for Signing up for Sigmyze</h1>
               <h3>Here is Your Code: ${code}</h3>`
    }

    transporter.sendMail(message, function(err, info) {
        if(err) console.log(err)
        transporter.close()
    })
}

function RecoveryEmail(code, email) {
    const transporter = GetTransporter()
    let message = {
        from: "sigmyze@gmail.com",
        to: email,
        subject: "Sigmyze Recovery Code",
        html: `<h1>You requested a code to change your password</h1>
               <h3>Here is your code: ${code}</h3>
               <h4>If you didnt send this, ignore this email</h4>`
    }

    transporter.sendMail(message, function(err, info) {
        if(err) console.log(err)
        transporter.close()
    })
}

exports.VerificationEmail = VerificationEmail
exports.RecoveryEmail     = RecoveryEmail