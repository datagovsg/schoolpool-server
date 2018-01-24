const express = require('express')
const path = require('path')
const logger = require('morgan')
const Cron = require('cron').CronJob
const axios = require('axios')
const backoff = require('backoff')
// var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

// var Sequelize = require('sequelize');

// this is the deine the DB
// var models = require('./models');

const users = require('./routes/Users')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

// enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET')
  next()
})

app.use('/users', users)
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// this is to initialize and get the auth0 master token
function initJWT() {
  const exponentialBackoff = backoff.exponential({
    randomisationFactor: 0,
    initialDelay: 20,
    maxDelay: 7200000,
    factor: 2,
  })


  exponentialBackoff.on('backoff', async (number) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://schoolpool.auth0.com/oauth/token',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
        },
      })
      process.env.AUTH0_MASTER_TOKEN = response.data.access_token
      exponentialBackoff.reset()
    } catch (e) {
      console.log(`failed to get JWT\nNumber fo tries ${number}`)
    }
  })

  exponentialBackoff.on('ready', () => {
    // Do something when backoff ends, e.g. retry a failed
    // operation (DNS lookup, API call, etc.). If it fails
    // again then backoff, otherwise reset the backoff
    // instance.
    exponentialBackoff.backoff()
  })

  exponentialBackoff.on('fail', () => {
    // Do something when the maximum number of backoffs is
    // reached, e.g. ask the user to check its connection.
    // TODO: Maybe need to alert the dev that Auth0 is not working
    console.log('failed to get JWT')
  })

  exponentialBackoff.backoff()
}

const cronJob = new Cron('59 59 22 * * *', () => {
  initJWT()
}, null, true, 'Asia/Singapore', true)

initJWT()
module.exports = app
