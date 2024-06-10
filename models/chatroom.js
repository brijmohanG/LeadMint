const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class ChatRoom extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    roomId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ownerId: {
        type: Sequelize.BIGINT,
    },
    password: {
        type: Sequelize.STRING(256)
    },
    maxCapacity: {
        type: Sequelize.BIGINT
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'chat_rooms',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: false
}

module.exports = ChatRoom.init(attributes, options)