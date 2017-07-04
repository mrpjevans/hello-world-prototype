'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   
      // As blocking is not important here, we'll use the 'sync' methods
      const bcrypt = require('bcrypt');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('password', salt);

      return queryInterface.bulkInsert('Users',[{
        username: 'admin',
        password_digest: hash,
        name: 'Admin',
        email: 'no-one@example.org',
        role: 'Admin',
        status: 'Out',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Users', null, {});
  }
};
