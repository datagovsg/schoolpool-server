const email = require('./email')
const sms = require('./sms')
const notification = require('./notification')

module.exports = {
  sendNotification: (message, userEmail) => {
    notification.sendNotification(message, userEmail)
  },
  sendSms: (to, message) => {
    sms.sendMessage(to, message)
  },
  sendEmail: (userName, userEmail, pairedUserName, pairedUserEmail) => {
    email.sendEmailToBothUsers(userName, userEmail, pairedUserName, pairedUserEmail)
  },
}
