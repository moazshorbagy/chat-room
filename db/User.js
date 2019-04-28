const BaseEntity = require('typeorm').BaseEntity;
const bcrypt = require('bcrypt-nodejs');

class User extends BaseEntity {

  constructor(id, userName, password) {
    super();

    this.id = id;
    this.userName = userName;
    this.password = password;
  }

  checkPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.encryptedPassword, (err, isValid) => {
        if (err)
          return reject(err);
        if (!isValid)
          return resolve(false);
        resolve(true);
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(12, (err, salt) => {
        if (err) return reject(err);

        bcrypt.hash(this.password, salt, null, (err,
          encryptedPassword) => {
          if (err) return reject(err);

          delete this.password;
          this.encryptedPassword = encryptedPassword;
          super.save().then(resolve).catch(reject);
        });
      });
    });
  }
}

module.exports = User;
