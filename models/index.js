const dbConfig = require('../config/config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('connected..');
    })
    .catch(err => {
        console.log('Error' + err);
    });

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.points = require("./points")(sequelize,DataTypes)
db.users =require("./users")(sequelize, DataTypes)
db.file = require("./file")(sequelize,DataTypes)
db.file_replicas = require("./file_replicas")(sequelize,DataTypes)
db.compressing = require("./compressFiles")(sequelize, DataTypes)
db.monitoring = require('./Monitoring')(sequelize, DataTypes)
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })

// Установка ассоциаций
// ----------user relations
db.points.hasMany(db.users, {
    foreignKey: 'pointId',
    as: 'user'
});

db.users.belongsTo(db.points, {
    foreignKey: 'pointId',
    as: 'points'
});
// ----------file relations
// ---users
db.users.hasMany(db.file, {
    foreignKey: 'userId',
    as: 'file'
});

db.file.belongsTo(db.users, {
    foreignKey: 'userId',
    as: 'user'
});


// replicas
// В модели file
db.file.hasMany(db.file_replicas, { foreignKey: 'fileId', as: 'file_replicas' });
db.file_replicas.belongsTo(db.file, { foreignKey: 'fileId', as: 'files' });

// points
db.points.hasMany(db.file_replicas, {foreignKey: 'pointId', as: 'file_replicas'});
db.file_replicas.belongsTo(db.points, {foreignKey: 'pointId', as: 'points'});



// In your association definitions
db.file.hasMany(db.compressing, { foreignKey: 'fileId', as: 'compressingEntries' });
db.compressing.belongsTo(db.file, { foreignKey: 'fileId', as: 'file' });

// monitoring association
db.file.hasMany(db.monitoring, {foreignKey: 'fileId', as: 'monitoring'});
db.monitoring.belongsTo(db.file, {foreignKey: 'fileId', as: 'file'})

// replicas association
db.file_replicas.hasMany(db.monitoring, {foreignKey: 'ReplicasId', as: 'monitoring'});
db.monitoring.belongsTo(db.file_replicas, {foreignKey: 'ReplicasId', as: 'file_replicas'})

module.exports = db;