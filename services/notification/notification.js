const config = require('../../config/config.js')
const axios = require('axios')

const API_KEY = `Basic ${config.apiKey}`
const APPLICATION_ID = config.appId
const oneSignalUrl = 'https://onesignal.com/api/v1/notifications'

module.exports = {
  sendNotification: (message, email) => {
    axios({
      method: 'POST',
      url: oneSignalUrl,
      port: '443',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: API_KEY,
      },
      data: {
        app_id: APPLICATION_ID,
        contents: {
          en: message,
        },
        filters: [{
          field: 'tag',
          key: 'user_email',
          relation: '=',
          value: email,
        },
        ],
      },
    }).then((response) => {
      console.log(response)
      return response
    })
  },
}
