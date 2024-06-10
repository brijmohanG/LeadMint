const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class FriendRequest extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    requestId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fromUserId: {
        type: Sequelize.STRING(256),
    },
    toUserId: {
        type: Sequelize.STRING(256)
    },
    status: {
        type: Sequelize.STRING
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'friend_requests',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: false
}

module.exports = FriendRequest.init(attributes, options)