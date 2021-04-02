const { User }  = require('../db/models/index');

const bcrypt = require('bcrypt');

const UserController = {
  createUser(req, res) {
    let { email, password, role, restaurant, username } = req.body;
    if (password) {
      password = bcrypt.hashSync(password, 10)
    }
    User.create({
      email,
      password,
      role,
      restaurant,
      username
    })
      .then((result) => {
        delete result.dataValues.password;
        res.status(201).json({code: 201, result});
      })
      .catch((error) => {
        if (error.name === 'SequelizeValidationError') {
          res.status(400).json({code: 400, message: 'Missing required data'})
          return;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
          res.status(403).json({code: 403, message: 'Email already in use'})
          return;
        }
        res.json(error)
      });
  },
  
  getAllUser(req, res) {
    User.findAll({
      attributes: {
        exclude: ['password']
      }
      })
      .then((result) => {
        console.log(result)
        res.status(200).json({code: 200, result});
      })
      .catch((error) => {
        res.json({error})
      });
  },

  getUserById(req, res) {
    const uid = req.params.id;
    User.findOne({
      where: {
        id: uid,
      },
      attributes: {
        exclude: ['password']
      }
    })
      .then((result) => {
        if (!result) {
          throw new Error('User not found')
        }
        res.status(200).json({code: 200, result});
      })
      .catch((error) => {
        res.status(404).json({code: 404, error: error.message})
      });
  },

  updateUser(req, res) {
    const uid = req.params.id;
    const { username, role, email } = req.body;
    let data = {};

    if (username) {
      data.username = username
    }
    if (role) {
      data.role = role
    }
    if (email) {
      data.email = email
    }
    User.update(
      data,
      { where: { id: uid }, returning: true },
      )
      .then(function([ rowsUpdate, [updatedUser] ]) {
        delete updatedUser.dataValues.password;
        res.status(200).json({code: 200, updatedUser});
      })
      .catch((error) => {
        if (error.name === 'SequelizeValidationError' || Object.keys(error).length === 0) {
          res.status(400).json({code: 400, message: 'Missing required data'})
          return;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
          res.status(403).json({code: 403, message: 'Email already in use'})
          return;
        }
        res.json(error);
      });
  },

  deleteUser(req, res) {
    const uid = req.params.id;
    User.destroy({
      where: {
        id: uid,
      }
    })
      .then((result) => {
        if (!result) {
          throw new Error('User not found')
        }
        res.status(200).json({code: 200, result, message: 'User deleted'})
      })
      .catch((error) => {
        res.status(404).json({code: 404, error: error.message})
      });
  },

}

module.exports = UserController;