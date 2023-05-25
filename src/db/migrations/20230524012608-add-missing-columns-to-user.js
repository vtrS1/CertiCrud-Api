"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("Users", "reset_password_token", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Users", "reset_password_token_sent_at", {
        type: Sequelize.DATE,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removecolumn("Users", "reset_password_token"),
      queryInterface.removecolumn("Users", "reset_password_token_sent_at"),
    ]);
  },
};
