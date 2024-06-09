const { Sequelize } = require('sequelize');
 
module.exports.sequelize = new Sequelize('users', 'root', '123456', {
    host: 'localhost',
    dialect:'mysql'
  })

  // try {
  //    sequelize.authenticate();
  //   console.log('Connection has been established successfully.');
  // } catch (error) {
  //   console.error('Unable to connect to the database:', error);
  // }

  // module.exports.sequelize = new Sequelize(database, username, password, options)