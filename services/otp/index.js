const otplib = require('otplib')
const config = require('../../config/config.js')

const { secretKey: OTP_SECRET_KEY } = config.OTP

otplib.totp.option = { step: 60 }

module.exports = {
  generateOTP: phoneNumber => otplib.totp.generate(`${phoneNumber} plus this mysterious key ${OTP_SECRET_KEY}`),
  checkOTP: (phoneNumber, otp) => otplib.totp.check(otp, `${phoneNumber} plus this mysterious key ${OTP_SECRET_KEY}`),
}
