const { Product }  = require('../db/models/index');

const ProductController = {
  createProduct(req, res) {
    let { name, flavor, complement, price, image, type, subtype } = req.body;
    if (price) {
      price = Number(price)
    }
    Product.create({
      name,
      flavor,
      complement,
      price,
      image,
      type,
      subtype
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

  getAllProduct(req, res) {
    Product.findAll({
    })
      .then((result) => {
        res.status(200).json({code: 200, result});
      })
      .catch((error) => {
        res.json({error})
      });
  },

  getProductById(req, res) {
    const productId = req.params.id;
    Product.findOne({
      where: {
        id: productId
      }
    })
    .then((result) => {
      if (!result) {
        throw new Error('Product Id not found')
      }
      res.status(200).json({code: 200, result});
    })
    .catch((error) => {
      res.status(404).json({code: 404, error: error.message})
    });
  },

  updateProduct(req, res) {
    const productId = req.params.id;
    const { price, image } = req.body;
    let data = {};

    if (price) {
      data.price = Number(price)
    }
    if (image) {
      data.image = image
    }
    Product.update(
      data,
      { where: { id: productId }, returning: true },
    )
    .then(function([ rowsUpdate, [updatedProduct] ]) {
      res.status(200).json({code: 200, updatedProduct});
    })
    .catch((error) => {
      if (Object.keys(error).length === 0) {
        res.status(400).json({code: 400, message: 'Missing required data'})
        return;
      }
      res.json(error)
    });
  },

  deleteProduct(req, res) {
    const productId = req.params.id;
    Product.destroy({
      where: {
        id: productId
      }
    })
    .then((result) => {
      if (!result) {
        throw new Error('Product Id not found')
      }
      res.status(200).json({code: 200, result, message: 'Product deleted'})
    })
    .catch((error) => {
      res.status(404).json({code: 404, error: error.message})
    });
  }

}

module.exports = ProductController;