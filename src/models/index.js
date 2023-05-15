'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const User = require('./User');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../configs/db.json')[env];
const db = {};
const models = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


models.User = require('./User')(sequelize, Sequelize.DataTypes);
models.KeyToken = require('./KeyToken')(sequelize, Sequelize.DataTypes);
models.Post = require('./Post')(sequelize, Sequelize.DataTypes);
models.PostCategory = require('./PostCategory')(sequelize, Sequelize.DataTypes);
models.Category = require('./Category')(sequelize, Sequelize.DataTypes);
models.Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
db.sequelize = sequelize;

module.exports = {
  db,
  models
};
