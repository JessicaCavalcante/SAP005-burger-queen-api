const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Bearer } = require('permit');

const { User } = require('../db/models/index');

const permit = new Bearer();

const AuthController = {
  login(req, res, next) {
    const { email, password } = req.body;

    User.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (!user) return res.status(400).json({ code: 400, error: 'Invalid e-mail and/or password' });

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ code: 400, error: 'Invalid e-mail and/or password' });
      }

      let jwtPayload = { email: user.email, restaurant: user.restaurant, uid: user.id };
      let token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

      return res.status(200).json({ token });
    }).catch(next);
  },

  auth(req, res, next) {
    const token = permit.check(req);

    if (!token) {
      permit.fail(res);
      return res.status(401).json({ code: 401, error: 'Authentication is required!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        permit.fail(res);
        return res.status(400).json({ code: 400, error: 'Failed to authenticate token!' });
      }

      req.loggedUser = decoded;
      next();
    });
  },
};

module.exports = AuthController;