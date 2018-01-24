const MockAdapter = require('axios-mock-adapter')
const sinon = require('sinon')
const axios = require('axios')
const sendGrid = require('@sendgrid/mail')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const models = require('../models')

const should = chai.should()

chai.use(chaiHttp)

// =============== start of test for success cases ================= //
describe('Users *All correct inputs*', () => {
  // after(() => {
  //   global.asyncDump()
  // })

  let sendGridStub
  beforeEach(() => {
    sendGridStub = sinon.stub(sendGrid, 'send')
    sendGridStub.returns()
  })
  afterEach(() => {
    sendGridStub.restore()
  })
  before(async () => {
    sendGridStub = sinon.stub(sendGrid, 'send')
    sendGridStub.returns()
    const mock = new MockAdapter(axios)
    mock.onPost('https://rest.clicksend.com/v3/sms/send')
      .reply(200, { message: 'message sent' })
      .onGet(/(^https:\/\/schoolpool.auth0.com\/api\/v2\/users\/){1}.+/)
      .reply(200, { picture: 'picture example' })
    await models.sequelize.sync()
    const user = {
      phoneNumber: '87956543',
      name: "trololol's neighbour",
      address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
      longitude: '103.836620800984',
      latitude: '1.43457623282093',
      schoolAddress: ['120212'],
    }
    await chai.request(app).post('/users').set('token', '{ "sub":"2","email":"soraino97@gmail.com"}').send(user)
    sendGridStub.restore()
  })
  describe('POST: /  (registration)', () => {
    it('should register the user into the app', (done) => {
      const user = {
        phoneNumber: '87321560',
        name: "trololol's neighbour",
        address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
        longitude: '103.836620800984',
        latitude: '1.43457623282093',
        schoolAddress: ['120212'],
      }
      chai.request(app).post('/users').set('token', '{ "sub": "1", "email": "personalstuff97@gmail.com" }').send(user)
        .then((res) => {
          res.should.have.status(201)

          should.exist(res.body.user)

          res.body.user.should.be.an('object')
          res.body.user.should.have.property('id')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('address')
          res.body.user.should.have.property('phoneNumber')
          res.body.user.should.have.property('schoolAddress')
          res.body.user.should.have.property('pairedId')
          res.body.user.should.have.property('profileURL')
          res.body.user.should.have.property('latlong')

          res.body.user.id.should.be.a('string')
          res.body.user.name.should.be.a('string')
          res.body.user.address.should.be.a('string')
          res.body.user.phoneNumber.should.be.a('string')
          res.body.user.schoolAddress.should.be.an('array')
          res.body.user.pairedId.should.be.a('string')
          res.body.user.latlong.should.be.an('object')
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  describe('PUT: / (update user data)', () => {
    it('should update the user\'s data', (done) => {
      const user = {
        name: 'changed name',
        phoneNumber: '87965500',
        address: '242 YISHUN RING ROAD HDB-YISHUN SINGAPORE 760242',
        longitude: '1.43270791512178',
        latitude: '103.840052416235',
        schoolAddress: ['120212'],
      }
      chai.request(app).put('/users').set('token', '{ "sub": "1", "email": "soraino@gmail.com" }').send(user)
        .then((res) => {
          res.should.have.status(200)
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  describe('GET: /nearby (gets all nearby users)', () => {
    it('should all nearby user', (done) => {
      chai.request(app).get('/users/nearby').set('token', '{ "sub": "1", "email": "soraino@gmail.com" }').send()
        .then((res) => {
          res.should.have.status(200)
          should.exist(res.body.users)
          res.body.should.have.property('users')
          res.body.users.should.be.an('array')
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  describe('GET: /{Userid} (gets single user)', () => {
    it('should a single user data', (done) => {
      chai.request(app).get('/users/2').set('token', '{ "sub": "1", "email": "soraino@gmail.com" }').send()
        .then((res) => {
          res.should.have.status(200)
          should.exist(res.body.user)
          res.body.user.should.be.an('object')

          res.body.user.should.be.an('object')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('address')
          res.body.user.should.have.property('phoneNumber')
          res.body.user.should.have.property('schoolAddress')
          res.body.user.should.have.property('pairedId')
          res.body.user.should.have.property('profileURL')
          res.body.user.should.have.property('latlong')

          res.body.user.name.should.be.a('string')
          res.body.user.address.should.be.a('string')
          res.body.user.phoneNumber.should.be.a('string')
          res.body.user.schoolAddress.should.be.an('array')
          res.body.user.pairedId.should.be.a('string')
          res.body.user.profileURL.should.be.a('string')
          res.body.user.latlong.should.be.an('object')
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  describe('GET: / (gets single user if they exist)', () => {
    it('should a single user data because user exist', (done) => {
      chai.request(app).get('/users').set('token', '{ "sub": "1", "email": "soraino@gmail.com" }').send()
        .then((res) => {
          res.should.have.status(200)
          should.exist(res.body.user)
          res.body.user.should.be.an('object')

          res.body.user.should.be.an('object')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('address')
          res.body.user.should.have.property('phoneNumber')
          res.body.user.should.have.property('schoolAddress')
          res.body.user.should.have.property('pairedId')
          res.body.user.should.have.property('profileURL')
          res.body.user.should.have.property('latlong')

          res.body.user.id.should.be.a('string')
          res.body.user.name.should.be.a('string')
          res.body.user.address.should.be.a('string')
          res.body.user.phoneNumber.should.be.a('string')
          res.body.user.schoolAddress.should.be.an('array')
          res.body.user.pairedId.should.be.a('string')
          res.body.user.profileURL.should.be.a('string')
          res.body.user.latlong.should.be.an('object')

          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
})
// =============== end of test for success cases ================= //


// =============== start of test for failure cases ================= //
describe('Users *All incorrect inputs*', () => {
  describe('POST:/ (register the user with the wrong credentials)', () => {
    it('should show error if a param is empty', (done) => {
      const user = {
        name: "trololol's neighbour",
        address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
        longitude: '103.836620800984',
        latitude: '1.43457623282093',
        schoolAddress: ['120212'],
      }
      chai.request(app).post('/users').set('token', '{ "sub": "3", "email": "test@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(400)
          done()
        })
    })

    it('should show error if phone number is invalid', (done) => {
      const user = {
        phoneNumber: '45646980681464684',
        name: "trololol's neighbour",
        address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
        longitude: '103.836620800984',
        latitude: '1.43457623282093',
        schoolAddress: ['120212'],
      }
      chai.request(app).post('/users').set('token', '{ "sub": "3", "email": "test@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(400)
          done()
        })
    })
    it('should show an error that the params data is wrong(longitude and latitude is wrong)', (done) => {
      const user = {
        longitude: 'fake_long',
        latitude: 'fake_lat',
        phoneNumber: '87426954',
        name: "trololol's neighbour",
        address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
        schoolAddress: ['120212'],
      }
      chai.request(app).post('/users').set('token', '{ "sub": "3", "email": "test@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(400)
          done()
        })
    })
    it('should show an error that the email exist in the dataabase', (done) => {
      const user = {
        longitude: '103.836620800984',
        latitude: '1.43457623282093',
        phoneNumber: '87426954',
        name: "trololol's neighbour",
        address: '230 YISHUN STREET 21 HDB-YISHUN SINGAPORE 760230',
        schoolAddress: ['120212'],
      }
      chai.request(app).post('/users').set('token', '{ "sub": "3", "email": "soraino97@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(400)
          done()
        })
    })
  })

  describe('PUT: / (update user\'s data wrong credentials)', () => {
    it('should show an error that the params data is wrong (empty params)', (done) => {
      const user = {
        address: '242 YISHUN RING ROAD HDB-YISHUN SINGAPORE 760242',
        longitude: '1.43270791512178',
        latitude: '103.840052416235',
        schoolAddress: ['120212'],
      }
      chai.request(app).put('/users').set('token', '{ "sub": "2", "email": "soraino97@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(401)
          done()
        })
    })
    it('should show an error that the params data is wrong (longtitude and latitude is worng)', (done) => {
      const user = {
        name: 'changed name',
        address: '242 YISHUN RING ROAD HDB-YISHUN SINGAPORE 760242',
        longitude: 'fake_long',
        latitude: 'fake_lat',
        schoolAddress: ['120212'],
      }
      chai.request(app).put('/users').set('token', '{ "sub": "2", "email": "soraino97@gmail.com" }').send(user)
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(401)
          done()
        })
    })
  })

  describe('GET:/{userId} (try to get a user\'s data by inputting the wrong user id)', () => {
    it('should show error if user doesn\'t exist', (done) => {
      chai.request(app).get('/users/3').set('token', '{ "sub": "1", "email": "soraino@gmail.com" }').send()
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(401)
          done()
        })
    })
  })

  describe('GET:/nearby (try to get nearby user\'s data without having a JWT)', () => {
    it('should show error if user dont\'t include their own JWT', (done) => {
      chai.request(app).get('/users/nearby').send()
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(401)
          done()
        })
    })
  })

  describe('GET:/ (Get user data without JWT', () => {
    it('shouldn\'t get user\'s data because user doesn\'t exist', (done) => {
      chai.request(app).get('/users').set('token', '{ "sub": "some random Id", "email": "SomeUnrelatedEmail@gmail.com" }').send()
        .then((res) => {
          done(res)
        })
        .catch((err) => {
          err.should.have.status(401)
          should.exist(err.response.body.errorMessage)
          err.response.body.errorMessage.should.be.a('string')
          err.response.body.errorMessage.should.be.equal('User doesn\'t exist in database')
          done()
        })
    })
  })
})

// =============== end of test for failure cases ================= //
