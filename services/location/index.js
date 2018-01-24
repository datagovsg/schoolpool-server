const models = require('../../models')
const sequelize = require('sequelize')
const notification = require('../notification')


module.exports = {
  notifyCarpooler: (latitude, longitude, newUser) => new Promise(async (resolve, reject) => {
    /**
     * Here's how the query looks like :
     * SELECT "id", "name", "address", "latlong", "phoneNumber", "schoolAddress"
     * FROM "Users" AS "Users"
     * WHERE (((ST_Dwithin("latlong",
     * CAST(ST_MakePoint(currUserLat, currUserLong) AS GEOGRAPHY), 5000))
     * AND "Users"."id" != currUserId AND "Users".id != "" and "Users"."schoolAddress" @> NULL))
     */
    const withinRange = sequelize.fn(
      'ST_Dwithin',
      sequelize.col('latlong'),
      sequelize.cast(sequelize.fn('ST_MakePoint', latitude, longitude), 'GEOGRAPHY'),
      500,
    )
    try {
      const user = await models.Users.findOne({
        where: {
          $and: {
            schoolAddress: {
              $contains: newUser.schoolAddress,
            },
            $and: withinRange,
            id: {
              $ne: newUser.id,
            },
          },
        },
        attributes: ['id', 'name', 'phoneNumber', 'email',
          [sequelize.fn(
            'ST_Distance',
            sequelize.col('latlong'),
            sequelize.cast(sequelize.fn('ST_MakePoint', latitude, longitude), 'GEOGRAPHY'),
          ), 'distance'],
        ],
        order: sequelize.col('distance'),
      })
      if (user != null) {
        await user.update({
          pairedId: newUser.id,
        })
        await newUser.update({
          pairedId: user.id,
        })
        notification.sendEmail(user.name, user.email, newUser.name, newUser.email)
        // notification.sendMessage(
        //   user.phoneNumber,
        //   `Hi, you've been paired up with ${user.name} \n` +
        //   `Here's this person's PhoneNumber: +65${user.phoneNumber}\n`,
        // )
        resolve()
      } else {
        resolve('No Users to pair with')
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  }),
  /**
     * Here's how the query looks like :
     * SELECT "id", "name", "address", "latlong", "phoneNumber", "schoolAddress"
     * FROM "Users" AS "Users"
     * WHERE (((ST_Dwithin("latlong",
     * CAST(ST_MakePoint(currUserLat, currUserLong) AS GEOGRAPHY), 5000))
     * AND "Users"."id" != currUserId) OR "Users"."schoolAddress" @> NULL)
     */
  findNearbyCarpooler: userId => new Promise(async (resolve, reject) => {
    try {
      // first i need to find the current user's coordinates
      const user = await models.Users.findOne({
        where: { id: userId },
        attributes: ['latlong', 'schoolAddress'],
      })
      const { latlong, schoolAddress } = user
      const withinRange = sequelize.fn(
        'ST_Dwithin',
        sequelize.col('latlong'),
        sequelize.cast(sequelize.fn('ST_MakePoint', latlong.coordinates[0], latlong.coordinates[1]), 'GEOGRAPHY'),
        5000,
      )
      const otherUsers = await models.Users.findAll({
        where: {
          $and: {
            $or: {
              schoolAddress: {
                $contains: schoolAddress,
              },
              $and: withinRange,
            },
            id: {
              $ne: userId,
            },
          },
        },
        attributes: ['id', 'name', 'address', 'schoolAddress',
          [sequelize.fn(
            'ST_Distance',
            sequelize.col('latlong'),
            sequelize.cast(sequelize.fn('ST_MakePoint', latlong.coordinates[0], latlong.coordinates[1]), 'GEOGRAPHY'),
          ), 'distance']],
        order: sequelize.col('distance'),
      })
      resolve(otherUsers)
    } catch (e) {
      reject()
    }
  }),
}
