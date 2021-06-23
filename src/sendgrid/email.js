const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_KEY);

const sendMailToClient = (name, email, emailName) => {
    const message = {
        to: email,
        from: "azhermurad@gmail.com",
        subject: "Testing Email",
        text: emailName == "welcomeemail" ? `welcome to our app. ${name}` : `Good bye ${name}. See you again`
    };
    sgMail.send(message)
}

sendMailToClient("azher ali", "azhermurad@gmail.com", "welcomeemail");

module.exports = {
    sendMailToClient
}



// javascript
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'test@example.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })