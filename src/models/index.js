'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var db        = {};
let model     = [];

var sequelize = null;


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // var model = sequelize['import'](path.join(__dirname, file));
    // db[model.name] = model;
    
    let modelPath = path.join(__dirname, file);
    let modelKey = file.slice(0, -3);

    model.push({
      modelKey,
      modelPath
    })
  });

module.exports = model;