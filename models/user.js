const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class User extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: Sequelize.STRING(15)
    },
    first_name: {
        type: Sequelize.STRING(100)
    },
    last_name: {
        type: Sequelize.STRING(100)
    },
    password: {
        type: Sequelize.STRING(100)
    },
    city: {
        type: Sequelize.STRING(50)
    },
    state: {
        type: Sequelize.STRING(50)
    },
    country: {
        type: Sequelize.STRING(50)
    },
    zip: {
        type: Sequelize.INTEGER(16)
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'user',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: true
}

module.exports = User.init(attributes, options)