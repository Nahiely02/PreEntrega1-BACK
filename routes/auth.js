const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../modelos/User');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

const router = express.Router();

// Ruta de registro
router.post('/register', [
  check('first_name').not().isEmpty(),
  check('last_name').not().isEmpty(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, password, age } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya existe' });
    }

    const newUser = new User({ first_name, last_name, email, password, age });
    await newUser.save();

    // Generar el token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token en la cookie
    res.cookie('token', token, {
      httpOnly: true,         // la cookie solo debe ser accesible desde el servidor
      secure: process.env.NODE_ENV === 'production',  // se enviará por HTTPS en producción
      maxAge: 3600000,        // Duración de la cookie 1 hora
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error de servidor' });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token en la cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,  // 1 hr
    });

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error de servidor' });
  }
});

// Ruta para obtener el usuario logueado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);  // Devuelve los datos del usuario asociado al JWT
});

module.exports = router;
