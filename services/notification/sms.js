const axios = require('axios')
const config = require('../../config/config')

const smsServiceUrl = 'https://rest.clicksend.com/v3/sms/send'
module.exports = {
  sendMessage: async (to, message) => {
    const messages = [{
      to: `+65${to}`,
      body: message,
      from: 'schoolpool',
    }]

    try {
      const response = await axios({
        method: 'POST',
        url: smsServiceUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: messages,
        auth: {
          username: config.SMS.user,
          password: config.SMS.apiKey,
        },
      })
      console.log(response)
      return
    } catch (e) {
      console.log(e)
    }
  },
}
