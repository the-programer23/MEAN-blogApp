const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPass) => {

    const newUser = new User({
      email: req.body.email,
      password: hashedPass,
    });

    newUser
      .save()
      .then((result) => {

        const token = jwt.sign({
          email: result.email,
          userId: result._id
        }, process.env.JWT_KEY, {
          expiresIn: "5m"
        })

        res.status(201).json({
          message: "user created",
          token: token,
          expiresIn: 3600,
          userId: result._id
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Este usuario ya está registrado",
        });
      });
  });
}

exports.loginUser = (req, res, next) => {
  let fetchedUser;

  User.findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Usuario no encontrado",
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Credenciales de autenticación no válidas",
        });
      }

      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_KEY, {
          expiresIn: "5m"
        }
      );


      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Usuario no registrado",
      });
    });
}
