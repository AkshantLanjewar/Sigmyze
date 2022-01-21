const nodemailer = require('nodemailer')

function VerificationEmail(code, email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'sigmyze@gmail.com',
            pass: 'MpwdfSi-Lunar@123'
        }
    })

    let message = {
        from: "sigmyze@gmail.com",
        to: email,
        subject: "Sigmyze Verification",
        html: `<h1>Thank you for Signing up for Sigmyze</h1>
               <h3>Here is Your Code: ${code}</h3>`
    }

    transporter.sendMail(message, function(err, info) {
        if(err) console.log(err)
    })
}

exports.VerificationEmail = VerificationEmail