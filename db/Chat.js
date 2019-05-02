const BaseEntity = require('typeorm').BaseEntity;

class Chat extends BaseEntity {

  constructor(id, userName, message) {
    super();

    this.id = id;
    this.userName = userName;
    this.message = message;
  }
}

module.exports = Chat;
