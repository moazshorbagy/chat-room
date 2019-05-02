const EntitySchema = require("typeorm").EntitySchema;

const Chat = require("./Chat");

const ChatSchema = new EntitySchema({
  name: "Chat",
  target: Chat,
  tableName: "chats",
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
    message: {
      type: "varchar",
      nullable: false
    }
  }
});

module.exports = ChatSchema;
