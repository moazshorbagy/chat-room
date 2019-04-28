const typeorm = require("typeorm");
const UserSchema = require('./UserSchema');

module.exports = new Promise((resolve, reject) => {
  typeorm.createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "da3m0ns",
    database: "chat",
    synchronize: true,
    entities: [UserSchema]
  }).then(resolve).catch(reject);
});

