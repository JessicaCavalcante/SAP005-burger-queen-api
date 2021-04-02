const { Order, ProductsOrder, User, Product }  = require('../db/models/index');

const OrderController =  {
  validateCreateData(data) {
    let isValid = true;
    data.forEach((item) => {
      if (!item.name || !item.qtd || item.qtd < 1) {
        isValid = false
      }
    })
    return isValid;
  },

  async createOrder(req, res) {
    const client_name = req.body.client_name;
    const table = req.body.table;
    const products = req.body.products;
    const user_id = req.loggedUser.uid;
    
    let storeOrderProduct = products.map(async (prod) => {
      if (!prod.id) {
        prod.id = 0;
      }
      const dbProd = await Product.findByPk(prod.id);
      console.log(dbProd)
      if (dbProd) {
        return {
          name: dbProd.name,
          complement: dbProd.complement,
          flavor: dbProd.flavor,
          product_id: prod.id,
          price: dbProd.price,
          qtd: prod.qtd,
        }
      }
      return prod;
    })
    storeOrderProduct = await Promise.all(storeOrderProduct);
    if (!OrderController.validateCreateData(storeOrderProduct)) {
      res.status(400).json({code: 400, message: 'Missing required data'})
      return;
    }
    Order.create({
      user_id: user_id,
      client_name,
      table,
      products: storeOrderProduct,
    }, {
      include: [{
        association: 'products',
        attributes: ['order_id', 'product_id', 'qtd', 'name', 'flavor', 'complement', 'price'],
        through: {
          attributes: []
        }
      }]
    })
    .then((result) => {
      res.status(201).json({code: 201, result});
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({code: 400, message: 'Missing required data'})
        return;
      }
    });
  },

  getAllOrder(req, res) {
    Order.findAll({
      include: [
        {
          association: 'products',
          attributes: [['product_id', 'id'], 'qtd', 'name', 'flavor', 'complement', 'price'],
        }
      ]
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({code: 200, result});
    })
    .catch((error) => {
      res.json(error)
    });
  },

  getOrderById(req, res) {
    const user_id = req.loggedUser.uid;
    Order.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          association: 'products',
          attributes: [['product_id', 'id'], 'qtd', 'name', 'flavor', 'complement', 'price'],
        }
      ]
    })
    .then((result) => {
      if (!result) {
        throw new Error('Order not found')
      }
      res.status(200).json({code: 200, result});
    })
    .catch((error) => {
      res.status(404).json({code: 404, error: error.message})
    });
  },

  updateOrder(req, res) {
    Order.update(
      {
        status: req.body.status,
        processedAt: new Date
      },
      { where: { id: req.params.id }, returning: false }
    )
    .then(function([ rowsUpdate]) {
      Order.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            association: 'products',
            attributes: [['product_id', 'id'], 'qtd', 'name', 'flavor', 'complement', 'price'],
          }
        ]
      })
      .then((result) => {
        console.log(result);
        res.status(200).json({code: 200, result});
      })
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError' || Object.keys(error).length === 0) {
        res.status(400).json({code: 400, message: 'Missing required data'})
        return;
      }
      res.json(error)
    });  
  },

  deleteOrder(req, res) {
    Order.destroy({
      where: {
        id: req.params.id
      }
    })
    .then((result) => {
      if (!result) {
        throw new Error('Order not found')
      }
      res.status(200).json({code: 200, result, message: 'Order deleted'})
    })
    .catch((error) => {
      res.status(404).json({code: 404, error: error.message})
    });
  }

}

module.exports = OrderController;