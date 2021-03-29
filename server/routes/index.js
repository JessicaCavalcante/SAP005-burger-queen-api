const { Router } = require('express')
const UserRouter = require('./UserRouter')
const AuthRouter = require('./AuthRouter')
const ProductRouter = require('./ProductRouter')

const router = Router()

// aqui vai todas as rotas
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/products', ProductRouter)

module.exports = router
