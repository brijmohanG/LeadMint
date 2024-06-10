const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class User extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    deviceId: {
        type: Sequelize.STRING(100),
    },
    phone: {
        type: Sequelize.STRING(15)
    },
    name: {
        type: Sequelize.STRING(100)
    },
    password: {
        type: Sequelize.STRING(100)
    },
    availCoins: {
        type: Sequelize.INTEGER
    },
    isPrime: {
        type: Sequelize.BOOLEAN
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'users',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: false
}

module.exports = User.init(attributes, options)