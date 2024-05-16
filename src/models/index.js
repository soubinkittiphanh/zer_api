const { Sequelize, DataTypes } = require('sequelize')
const logger = require('../api/logger')
const env = require('../config/env').db
const sequelize = new Sequelize(
    env.database,
    env.user,
    env.password,
    {
        host: env.host,
        dialect: 'mariadb',
        port: env.port,
        pool: {
            max: 10,
            min: 10,
            acquire: 30000,
            idle: 10000
        }
    }, {
    define: {
        indexes: false,
    }
}
)

// Connect to the tutorial database
// const tutorialDB = new Sequelize('tutorial_db', env.user, env.password, {
//     host: env.host,
//     dialect: 'mariadb',
//     port: env.port,
//     pool: {
//         max: 5,
//         min: 2,
//         acquire: 30000,
//         idle: 10000
//     }
// });
// Authenticate tutorial db
// tutorialDB.authenticate().then(() => {
//     logger.info("tutorial_db Connection established")
// }).catch(err => {
//     logger.error("tutorial_db Connection error: " + err);
// })


sequelize.authenticate().then(() => {
    logger.info("client_db Connection established")
}).catch(err => {
    logger.error("client_db Connection error: " + err);
})

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize
// db.centralSequelize = tutorialDB;
db.user = require("../operator/model")(sequelize, DataTypes);
db.Member = require("../member/model")(sequelize, DataTypes);
db.Currency = require("../currency/model")(sequelize, DataTypes);
db.Bank = require("../bank/model")(sequelize, DataTypes);
db.Account = require("../account/model")(sequelize, DataTypes);
db.FundsTransfer = require("../funds_transfer/model")(sequelize, DataTypes);
db.menuHeader = require("../menu/model")(sequelize, DataTypes);
db.menuLine = require("../menu/line/model")(sequelize, DataTypes);
db.group = require("../group/model")(sequelize, DataTypes);
db.authority = require("../authority/model")(sequelize, DataTypes);
db.terminal = require("../terminal/model")(sequelize, DataTypes);

db.user.belongsTo(db.group, {
    foreignKey: 'groupId',
    as: 'userGroup'
})
db.menuHeader.belongsToMany(db.menuLine, { through: 'MenuHeaderLines' })
db.menuLine.belongsToMany(db.menuHeader, { through: 'MenuHeaderLines' })

db.user.belongsToMany(db.terminal, { through: 'UserTerminals' })
db.terminal.belongsToMany(db.user, { through: 'UserTerminals' })
db.authority.belongsToMany(db.group, { through: 'GroupAuthorities' })
db.group.belongsToMany(db.authority, { through: 'GroupAuthorities' })

db.menuHeader.belongsToMany(db.group, { through: 'GroupMenuHeader' })
db.group.belongsToMany(db.menuHeader, { through: 'GroupMenuHeader' })


db.Account.belongsTo(db.Bank,{
    foreignKey: 'bankId',
    as: 'bank'
})
db.Account.belongsTo(db.Member,{
    foreignKey: 'memberId',
    as: 'member'
})
db.Account.belongsTo(db.Currency,{
    foreignKey: 'currencyId',
    as: 'currency'
})
db.FundsTransfer.belongsTo(db.Account,{
    foreignKey: 'accountId',
    as: 'account'
})
db.FundsTransfer.belongsTo(db.user,{
    foreignKey: 'inputterId',
    as: 'inputter'
})
db.FundsTransfer.belongsTo(db.user,{
    foreignKey: 'authorisorId',
    as: 'authorisor'
})

db.Member.hasMany(db.Account,{
    as:'accounts'
})
db.Account.hasMany(db.FundsTransfer,{
    as:'transactions'
})
db.Bank.hasMany(db.Account,{
    as:'accounts'
})



db.sequelize.sync({ force: false, alter: true }).then(() => {
    logger.info("Datatase client is synchronize")
})

module.exports = db