'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductsOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductsOrder.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'productsOrder'
      })

    }
  };
  ProductsOrder.init({
    order_id: DataTypes.INTEGER,
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Product Id is empty or not found'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    },
    flavor: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Flavor cannot be empty'
        },
        isAlpha: {
          msg: ' Will only allowed letter'
        }
      }
    },
    complement: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Complement cannot be empty'
        },
        isAlpha: {
          msg: ' Will only allowed letter'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Price must be an integer'
        },
        notNull: {
          msg: 'Price is required'
        }
      }
    },
    qtd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Quantity must be an integer'
        },
        notNull: {
          msg: 'Quantity is required'
        },
        min: {
          args: [[1]],
          msg: 'Quantity only allow values >= 1'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'ProductsOrder',
  });

  ProductsOrder.addHook('afterCreate', 'excludeAttr', (record) => {
    record.dataValues.id = record.dataValues.product_id;
    delete record.dataValues.order_id;
    delete record.dataValues.updatedAt;
    delete record.dataValues.createdAt;
    delete record.dataValues.product_id;
  });

  return ProductsOrder;
};