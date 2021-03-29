'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty"
        },
        notNull: {
          msg: "Name is required"
        }
      }
    },
    flavor: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Flavor cannot be empty"
        },
        isAlpha: {
          msg: " Will only allowed letter"
        }
      }
    },
    complement: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Complement cannot be empty"
        },
        isAlpha: {
          msg: " Will only allowed letter"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Price must be an integer"
        },
        notNull: {
          msg: "Price is required"
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "Image must be a Url"
        },
        notNull: {
          msg: "Image is required"
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Type cannot be empty"
        },
        notNull: {
          msg: "Type is required"
        }
      }
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Subtype cannot be empty"
        },
        notNull: {
          msg: "Subtype is required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};