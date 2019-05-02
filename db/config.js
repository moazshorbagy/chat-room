const typeorm = require("typeorm");
const UserSchema = require('./UserSchema');
const ChatSchema = require('./ChatSchema');

module.exports = new Promise((resolve, reject) => {
  typeorm.createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345678",
    database: "chat",
    synchronize: true,
    entities: [UserSchema, ChatSchema]
  }).then(resolve).catch(reject);
});

