const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'menatosamir55@gmail.com',
        subject: 'Thanks For joining us',
        text: `Welcome to the App, ${name}. Let me know how you get along with the app`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'menatosamir55@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you some time soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

