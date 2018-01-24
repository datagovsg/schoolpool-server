module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latlong: {
      type: DataTypes.GEOGRAPHY,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },
    schoolAddress: {
      type: DataTypes.ARRAY(DataTypes.STRING(6)),
      defaultValue: [],
    },
    pairedId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  })
  return User
}
/* {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Child)
      },
    },
  } */
