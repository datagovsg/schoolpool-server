const config = require('../../config/config')
const twilio = require('twilio')(config.Twilio.accountSID, config.Twilio.authToken)

async function checkPhoneNumber(phoneNumber) {
  try {
    const number = await twilio.lookups.v1
      .phoneNumbers(phoneNumber)
      .fetch({ countryCode: 'SG', type: 'carrier' })
    return number
  } catch (e) {
    return e
  }
}

module.exports = {
  phoneIsValid: async (phoneNumber) => {
    const responds = await checkPhoneNumber(`+65${phoneNumber}`)
    if (responds.status === undefined) {
      return true
    }
    return false
  },
}
