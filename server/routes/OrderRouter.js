const { Router } = require('express')
const OrderController = require('../controller/OrderController')
const AuthController = require('../controller/AuthController')

const router = Router()

router.post('/', AuthController.auth, OrderController.createOrder)
router.get('/', AuthController.auth, OrderController.getAllOrder)
router.get('/:id', AuthController.auth, OrderController.getOrderById)
router.put('/:id', AuthController.auth, OrderController.updateOrder)
router.delete('/:id', AuthController.auth, OrderController.deleteOrder)

module.exports = router