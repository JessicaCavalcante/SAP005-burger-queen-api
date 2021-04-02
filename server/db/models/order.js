'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Order.belongsToMany(models.Product, {
        foreignKey: 'order_id',
        through: 'ProductsOrders',
        as: 'productsOrder'
      });
      Order.hasMany(models.ProductsOrder, {
        foreignKey: 'order_id',
        as: 'products'
      })
    }
  };
  Order.init({
    user_id: DataTypes.INTEGER,
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Client name cannot be empty'
        },
        notNull: {
          msg: 'Client name is required'
        }
      }
    },
    table: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Table must be an integer'
        },
        notNull: {
          msg: 'Table is required'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Status cannot be empty'
        },
        notNull: {
          msg: 'Status is required'
        }
      }
    },
    processedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};