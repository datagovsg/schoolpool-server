const setting = {
  Database: {
    dbUrl: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    pool: {
      max: 18,
      min: 0,
      idle: 10000,
    },
  },
  OneSignal: {
    appId: process.env.ONE_SIGNAL_APP_ID,
    apiKey: process.env.ONE_SIGNAL_API_KEY,
  },
  OTP: {
    secretKey: process.env.OTP_SECRET_KEY,
  },
  Twilio: {
    accountSID: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
  SMS: {
    user: process.env.SMS_USERNAME,
    apiKey: process.env.SMS_API_KEY,
  },
  Auth: {
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },
  SendGrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    template: {
      welcomeMail: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
    },
  },
}

module.exports = setting
