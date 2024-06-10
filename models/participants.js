const Sequelize = require('sequelize')
const db = require('../index')
const database = db.sequelize

// 1) Create Model or Entity.
class Paricipants extends Sequelize.Model{

}

// 2) Create Attributes or Columns.
const attributes = {
    roomId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.BIGINT,
    }
}

// 3) Create Options for table.
const options = {
    sequelize: database,
    modelName: 'participants',
    // It will not make modelName plural, default value is false.
    freezeTableName: true,
    // It will not create createdAt and updatedAt columns in table.
    timestamps: false
}

module.exports = Paricipants.init(attributes, options)