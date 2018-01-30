const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const axios = require('axios')
const models = require('../models')
const location = require('../services/location')
const twilio = require('../services/twilio')

const router = express.Router()

// this is the function to validate and decode the JWT
function decodeJWT(_jwToken) {
  if (process.env.REQUIRE_TOKEN !== 'false') {
    try {
      const publicCert = fs.readFileSync('public.pem')
      const decode = jwt.verify(_jwToken, publicCert)
      return decode
    } catch (e) {
      throw Error(e)
    }
  } else {
    return JSON.parse(_jwToken)
  }
}

// this is to check if the form data is empty or null
function isEmpty(val) {
  return !!((val === undefined || val == null || val.length <= 0))
}

// this is the middleware to validate the JWT
router.use(async (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    const { token: jwToken } = req.headers
    if (process.env.REQUIRE_TOKEN !== 'false') {
      try {
        if (isEmpty(jwToken)) {
          res.status(401).send('Authentication failed: Please input token')
        } else {
          await decodeJWT(jwToken)
          next()
        }
      } catch (e) {
        console.log(e)
        res.status(401).send('Authentication failed: Invalid token')
      }
    } else if (process.env.REQUIRE_TOKEN === 'false') {
      if (isEmpty(jwToken)) {
        res.status(401).send('Authentication failed: Please input token')
      } else {
        next()
      }
    } else {
      // Something has gone horribly wrong 😢
      // maybe some hackers ?? if so nice try XD
      res.status(500).send('An error has occured')
    }
  } else {
    next()
  }
})

// this is to validate the registration data
async function checkForm(formbody, token) {
  let formKeys
  if (process.env.REQUIRE_TOKEN !== 'false') {
    formKeys = ['phoneNumber', 'name', 'address', 'longitude', 'latitude', 'schoolAddress'/* , 'otp' */]
  } else {
    formKeys = ['phoneNumber', 'name', 'address', 'longitude', 'latitude', 'schoolAddress']
  }
  // errorMessage will contain all the error message
  const errorMessage = formKeys.reduce((message, currKey) => ((isEmpty(formbody[currKey])) ? message.concat(`Error : ${currKey} constraint is empty`) : message), [])
  // this is to check if there's any unique constriants clashing
  if (!isEmpty(formbody.phoneNumber)) {
    try {
      const users = await models.Users.findAll({
        where: {
          $and: {
            phoneNumber: formbody.phoneNumber,
            id: {
              $ne: token.sub,
            },
          },
        },
      })
      if (users.length > 0) {
        errorMessage.push(`Error : Phone number (${formbody.phoneNumber}) has already been used`)
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (!isEmpty(formbody.longitude) || !isEmpty(formbody.latitude)) {
    const longitude = parseFloat(formbody.longitude)
    const latitude = parseFloat(formbody.latitude)
    if (Number.isNaN(Number(longitude)) || Number.isNaN(Number(latitude))) {
      errorMessage.push('Error : Please enter valid address')
    }
  }
  if (!isEmpty(token.email)) {
    try {
      const users = await models.Users.findAll({
        where: {
          $and: {
            email: token.email,
            id: {
              $ne: token.sub,
            },
          },
        },
      })
      if (users.length > 0) {
        errorMessage.push(`Error : Email (${token.email}) has already been used`)
      }
    } catch (e) {
      console.log(e)
    }
  }
  return errorMessage // never trust the user
}

async function getUserImage(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://schoolpool.auth0.com/api/v2/users/${id}`,
      headers: {
        Authorization: `Bearer ${process.env.AUTH0_MASTER_TOKEN}`,
      },
    })
    return response.data.picture
  } catch (e) {
    console.log(e)
    return null
  }
}

function generateNoise() {
  let noise = Math.floor((Math.random() * 99) + 1)
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1
  noise = (noise / 100000) * plusOrMinus
  return noise
}

// Add noise data into long and lat
function addNoiseToLocation(latlong) {
  latlong.coordinates[0] += generateNoise()
  latlong.coordinates[1] += generateNoise()
}

// code for upserting user credentials
// we don't really need to validate wheter if the user is able to update their data from a post
// this is because both of then practically does the same function when they access the database
// which they touch the same base code and do the same stuff
// just that one is update and another is insert
function upsertUserData(userCred) {
  return new Promise(async (resolve, reject) => {
    try {
      // if (process.env.REQUIRE_TOKEN !== 'false') {
      //   otp.checkOTP(userCred.phoneNumber, userCred.otp)
      // }
      // delete userCred.otp // removing the otp to make sure it doesn't interfere with the upsert
      await models.Users.upsert(userCred)
      // I needed to call find here is because upsert doesn't return a model
      const user = await models.Users.findOne({
        where: { id: userCred.id },
      })
      const profileURL = await getUserImage(userCred.id)
      addNoiseToLocation(user.latlong)
      resolve({
        user,
        message: {
          id: user.id,
          name: user.name,
          address: user.address,
          latlong: user.latlong,
          phoneNumber: user.phoneNumber,
          schoolAddress: user.schoolAddress,
          pairedId: user.pairedId,
          email: user.email,
          profileURL,
        },
      })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * @api {post} /user Register a single user
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 * @apiParam (Required Param) {String}  phoneNumber  User's phone number
 * @apiParam (Required Param) {String}  name  User's name
 * @apiParam (Required Param) {String}  address  User's house postal code
 * @apiParam (Required Param) {String}  longitude  User's house logitude
 * @apiParam (Required Param) {String}  latitude  User's house latitude
 * @apiParam (Required Param) {Array}  schoolAddress  User's children postal code
 *
 * @apiSuccess {String} message  success message.
 * @apiSuccess {String} id  User's Id.
 * @apiSuccess {String} name  User's name.
 * @apiSuccess {String} address  User's house postal code..
 * @apiSuccess {Array} latlong  User's house in latitude and Longitude.
 * @apiSuccess {String} phoneNumber  User's Id.
 * @apiSuccess {String} pairedId  User's paired parent Id.
 * @apiSuccess {String} email  User's email.
 * @apiSuccess {String} profileURL  User's profile picture URL.
 * @apiSuccess {Array} schoolAddress  User's children school postal code.
 *
 * @apiError (Error 400) IncompleteFormData An array of error's will be send
 * @apiError (Error 400) InvalidPhoneNumber This will be shown:
 * <code>["Error : Phone number is invalid"]</code>
 * @apiError (Error 400) NoTokenFound This will be shown:
 * <code>["Error : No token key present"]</code>
 *
 * @apiError (Error 500) InternalServerError This will be shown:
 * <code>["Error : Registration failed"]</code> this could cause due to having an invalid token
 */
router.post('/', async (req, res) => {
  const { token: jwToken } = req.headers
  let errorMessage = []
  try {
    if (!isEmpty(jwToken)) {
      const decode = await decodeJWT(jwToken)

      // check if the form data is correct or not
      errorMessage = await checkForm(req.body, decode)
      if (errorMessage.length !== 0) { // if there's no error message means it is ok
        res.status(400)
          .send({
            message: 'An error has occured',
            errorMessage,
          })
        return
      }

      const phoneValidity = await twilio.phoneIsValid(req.body.phoneNumber)
      if (!phoneValidity) {
        errorMessage.push('Error : Phone number is invalid')
        res.status(400)
          .send(errorMessage)
        return
      }
      const userLatLong = {
        type: 'Point',
        coordinates: [req.body.latitude, req.body.longitude],
      }
      const newUser = await upsertUserData({
        id: decode.sub,
        email: decode.email,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        latlong: userLatLong,
        schoolAddress: req.body.schoolAddress,
        otp: req.body.otp,
      })
      res.status(201)
        .send({
          message: 'Registration completed',
          user: newUser.message,
        })
      location.notifyCarpooler(req.body.latitude, req.body.longitude, newUser.user)
    } else {
      errorMessage.push('Error : No token key present')
      res.status(401)
        .send(errorMessage)
    }
  } catch (e) {
    console.log(e)
    errorMessage.push('Error : Registration failed')
    res.status(500)
      .send(errorMessage)
  }
})

/**
 * @api {post} /generate-otp Generate a OTP for a user
 * @apiName GenerateOTP
 * @apiGroup User
 * @apiDeprecated There's no JWT authentication implemented yet
 *
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 * @apiParam (Required Param) {String}  phoneNumber  User's phone number
 *
 * @apiSuccess {String} message  success message.
 *
 * @apiError (Error 400) IncompleteFormData An array of error's will be send
 * @apiError (Error 400) InvalidPhoneNumber This will be shown:
 * <code>["Error : Phone number is invalid"]</code>
 *
 */
router.post('/generate-otp', async (req, res) => {
  const errorMessage = []
  if (!isEmpty(req.body.phoneNumber)) {
    const phoneValidity = await twilio.phoneIsValid(req.body.phoneNumber)
    if (!phoneValidity) {
      errorMessage.push('Error : Phone number is invalid')
      res.status(400)
        .send(errorMessage)
      return
    }

    // const otpCode = otp.generateOTP(req.body.phoneNumber)
    // sms.sendMessage(
    //   req.body.phoneNumber,
    //   `Your OTP code is ${otpCode}`,
    // )

    res.status(200).send({ message: 'OTP has been sent' })
  } else {
    errorMessage.push('Error : phoneNumber constraint is empty')
    res.status(400).send({ errorMessage })
  }
})

/**
 * @api {put} /user Update a single user
 * @apiName PutUser
 * @apiGroup User
 *
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 * @apiParam (Required Param) {String}  phoneNumber  User's phone number
 * @apiParam (Required Param) {String}  name  User's name
 * @apiParam (Required Param) {String}  address  User's house postal code
 * @apiParam (Required Param) {String}  longitude  User's house logitude
 * @apiParam (Required Param) {String}  latitude  User's house latitude
 * @apiParam (Required Param) {Array}  schoolAddress  User's children postal code
 *
 * @apiSuccess {String} message  success message.
 * @apiSuccess {String} id  User's Id.
 * @apiSuccess {String} name  User's name.
 * @apiSuccess {String} address  User's house postal code..
 * @apiSuccess {Array} latlong  User's house in latitude and Longitude.
 * @apiSuccess {String} phoneNumber  User's Id.
 * @apiSuccess {String} pairedId  User's paired parent Id.
 * @apiSuccess {String} email  User's email.
 * @apiSuccess {String} profileURL  User's profile picture URL.
 * @apiSuccess {Array} schoolAddress  User's children school postal code.
 *
 * @apiError (Error 400) IncompleteFormData An array of error's will be send
 * @apiError (Error 400) NoTokenFound This will be shown:
 * <code>["Error : No token key present"]</code>
 *
 * @apiError (Error 500) InternalServerError This will be shown:
 * <code>["Error : Registration failed"]</code><br> this could cause due to having an invalid token
 */
router.put('/', async (req, res) => {
  try {
    const { token: jwToken } = req.headers
    if (isEmpty(jwToken)) {
      res.status(401)
        .send({
          errorMessage: 'Authentication failed: Please input token',
        })
    } else {
      const decode = await decodeJWT(jwToken)
      const errorMessage = await checkForm(req.body, decode)
      if (errorMessage.length !== 0) { // if there's no error message means it is ok
        res.status(401).send({
          message: 'An error has occured',
          errorMessage,
        })
        return
      }
      const userLatLong = {
        type: 'Point',
        coordinates: [req.body.latitude, req.body.longitude],
      }
      const user = await upsertUserData({
        id: decode.sub,
        email: decode.email,
        name: req.body.name,
        address: req.body.address,
        latlong: userLatLong,
        schoolAddress: req.body.schoolAddress,
        phoneNumber: req.body.phoneNumber,
        otp: req.body.otp,
      })
      res.status(200).send({
        message: 'Your data has been updated',
        user: user.message,
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ errorMessage: 'An error has occured' })
  }
})

/**
 * @api {get} /user Get current user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 *
 * @apiSuccess {String} User.id  User's Id.
 * @apiSuccess {String} User.name  User's name.
 * @apiSuccess {String} User.address  User's house postal code..
 * @apiSuccess {Array} User.latlong  User's house in latitude and Longitude.
 * @apiSuccess {String} User.phoneNumber  User's Id.
 * @apiSuccess {String} User.pairedId  User's paired parent Id.
 * @apiSuccess {String} User.profileURL  User's profile picture URL.
 * @apiSuccess {Array} User.schoolAddress  User's children school postal code.
 *
 * @apiError (Error 401) NoTokenFound This will be shown:
 * <code>["Error : No token key present"]</code>
 *
 * @apiError (Error 500) InternalServerError This will be shown:
 * <code>["Error : Registration failed"]</code><br> this could cause due to having an invalid token
 */
router.get('/', async (req, res) => {
  const { token: jwToken } = req.headers
  try {
    if (isEmpty(jwToken)) {
      res.status(401)
        .send({
          errorMessage: 'Authentication failed: Please input token',
        })
    } else {
      const decode = await decodeJWT(jwToken)
      const { sub: userId } = decode
      const user = await models.Users.findOne({
        where: { id: userId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
      if (user == null) {
        res.status(401).send({ errorMessage: 'User doesn\'t exist in database' })
        return
      }
      const profileURL = await getUserImage(userId)
      addNoiseToLocation(user.latlong)
      res.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          address: user.address,
          latlong: user.latlong,
          phoneNumber: user.phoneNumber,
          schoolAddress: user.schoolAddress,
          pairedId: user.pairedId,
          profileURL,
        },
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500)
      .send({ errorMessage: 'An error has occured' })
  }
})

/**
 * @api {get} /user/nearby Get nearby user's
 * @apiName GetNearbyUser
 * @apiGroup User
 *
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 *
 * @apiSuccess {Array}   users  Array of users data
 *
 * @apiError (Error 401) NoTokenFound This will be shown:
 * <code>["Error : No token key present"]</code>
 *
 * @apiError (Error 500) InternalServerError This will be shown:
 * <code>["Error : Registration failed"]</code><br> this could cause due to having an invalid token
 */
router.get('/nearby', async (req, res) => {
  try {
    const { token: jwToken } = req.headers
    if (isEmpty(jwToken)) {
      res.status(401).send({ errorMessage: 'Authentication failed: Please input token' })
    } else {
      const decode = await decodeJWT(jwToken)
      const { sub: userId } = decode
      const nearbyCarpoolers = await location.findNearbyCarpooler(userId)
      res.status(200).send({ users: nearbyCarpoolers })
    }
  } catch (e) {
    console.log(e)
    res.status(500)
      .send({
        errorMessage: 'An error has occured',
      })
  }
})

/**
 * @api {get} /user/:userId Get single user
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam (Required URL Param) {String}  userId  Id of the User you want to view
 * @apiParam (Required Header) {String}  token  JWT created from Auth0
 *
 * @apiSuccess {String} User.id  User's Id.
 * @apiSuccess {String} User.name  User's name.
 * @apiSuccess {String} User.address  User's house postal code..
 * @apiSuccess {Array} User.latlong  User's house in latitude and Longitude.
 * @apiSuccess {String} User.phoneNumber  User's Id.
 * @apiSuccess {String} User.pairedId  User's paired parent Id.
 * @apiSuccess {String} User.profileURL  User's profile picture URL.
 * @apiSuccess {Array} User.schoolAddress  User's children school postal code.
 *
 * @apiError (Error 401) NoTokenFound This will be shown:
 * <code>["Error : No token key present"]</code>
 * @apiError (Error 401) NoUserFound This will be shown:
 * <code>["User doesn't exist in database"]</code>
 * @apiError (Error 500) InternalServerError This will be shown:
 * <code>["Error : Registration failed"]</code><br> this could cause due to having an invalid token
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  if (!isEmpty(userId)) {
    try {
      const user = await models.Users.findOne({
        where: { id: userId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
      if (user == null) {
        res.status(401).send({ errorMessage: 'User doesn\'t exist in database' })
        return
      }
      const profileURL = await getUserImage(userId)
      addNoiseToLocation(user.latlong)
      res.status(200).send({
        user: {
          name: user.name,
          address: user.address,
          latlong: user.latlong,
          phoneNumber: user.phoneNumber,
          schoolAddress: user.schoolAddress,
          pairedId: user.pairedId,
          profileURL,
        },
      })
    } catch (e) {
      res.status(401).send({ errorMessage: 'User doesn\'t exist in database' })
    }
  } else {
    res.status(400)
      .send({
        errorMessage: 'Please enter userId',
      })
  }
})

module.exports = router
