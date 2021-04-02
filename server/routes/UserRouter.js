const { Router } = require('express')
const UserController = require('../controller/UserController')
const AuthController = require('../controller/AuthController')

const router = Router()

router.post('/', UserController.createUser)
router.get('/', AuthController.auth, UserController.getAllUser)
router.get('/:id', AuthController.auth, UserController.getUserById)
router.put('/:id', AuthController.auth, UserController.updateUser)
router.delete('/:id', AuthController.auth, UserController.deleteUser)

module.exports = router