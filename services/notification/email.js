const config = require('../../config/config')
const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(config.SendGrid.apiKey)

async function sendMessage(name1, name2, email) {
  const mail = {
    from: 'soraino97@gmail.com',
    to: email,
    html: '<p></p>',
    subject: '',
    templateId: config.SendGrid.template.welcomeMail,
    substitutions: {
      userName: name1,
      pairedUserName: name2,
    },
  }
  try {
    await sendGrid.send(mail)
  } catch (e) {
    throw new Error({ message: 'Message is not sent', Exception: e })
  }
}
module.exports = {
  // well anyone in the future who wants to await this can do so now
  sendEmailToBothUsers: async (userName, userEmail, pairedUserName, pairedUserEmail) => {
    try {
      await sendMessage(userName, pairedUserName, userEmail)
      await sendMessage(pairedUserName, userName, pairedUserEmail)
    } catch (e) {
      throw new Error({ message: 'Message is not sent', Exception: e })
    }
  },
}
