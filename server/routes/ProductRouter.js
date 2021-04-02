const { Router } = require('express')
const ProductController = require('../controller/ProductController')
const AuthController = require('../controller/AuthController')

const router = Router()

router.post('/', AuthController.auth, ProductController.createProduct)
router.get('/', AuthController.auth, ProductController.getAllProduct)
router.get('/:id', AuthController.auth, ProductController.getProductById)
router.put('/:id', AuthController.auth, ProductController.updateProduct)
router.delete('/:id', AuthController.auth, ProductController.deleteProduct)

module.exports = router