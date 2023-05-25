"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Candidates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Candidates.init(
    {
      name: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      email: DataTypes.STRING,
      salaryclaim: DataTypes.STRING,
      city: DataTypes.STRING,
      vacancy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Candidates",
    }
  );
  return Candidates;
};
