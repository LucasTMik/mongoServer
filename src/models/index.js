'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var db        = {};

var sequelize = null;


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // var model = sequelize['import'](path.join(__dirname, file));
    // db[model.name] = model;
    console.log(file);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = db;