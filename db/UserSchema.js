const EntitySchema = require("typeorm").EntitySchema;

const User = require("./User");

const UserSchema = new EntitySchema({
  name: "User",
  target: User,
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true
    },
    userName: {
      type: "varchar",
      nullable: false
    },
    encryptedPassword: {
      type: "varchar",
      nullable: false
    }
  }
});

module.exports = UserSchema;
