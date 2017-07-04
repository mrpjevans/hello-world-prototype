const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            notEmpty: true,
            isUnique(value, next) {
              // Are there are records that use my username?
              User.find({
                    where: {username: value},
                }).then((user) => {
                  // If a user is found and we are inserting or (updating and this is not our ID), fail
                  if (user && (this.id == null || user.id != this.id)) {
                    next('username_in_use');
                  } else {
                    next();
                  }
                });
            }
          }
        },
        password_digest: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: true,
          }
        },
        password: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },
        confirm_password: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
          validate: {
            notEmpty: true,
            matchesPassword(value, next) {

              // Check the password fields match
              if (this.password != this.confirm_password) {

                next('password_mismatch');

              } else {

                // Now encrypt the password and store it
                bcrypt.hash(this.password, 10, (err, hash) => {
                  this.password_digest = hash;
                  next();
                });

              }

            }
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true
          }
        },
        role: {
          type: DataTypes.ENUM('Admin','User'),
          allowNull: false,
          defaultValue: 'Out',
          validate: {
            isIn: [['Admin','User']]
          }
        },
        status: {
          type: DataTypes.ENUM('In','Out','Busy'),
          allowNull: false,
          defaultValue: 'Out',
          validate: {
            isIn: [['In','Out','Busy']]
          }
        }
    }, {
        classMethods:{

        },
    });
    return User;
};
