const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class Message extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    messageId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    roomId: {
        type: Sequelize.BIGINT,
    },
    userId: {
        type: Sequelize.STRING,
    },
    message: {
        type: Sequelize.STRING,
    },
    timestamp: {
        type: Sequelize.DATE
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'message',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: false
}

module.exports = Message.init(attributes, options)