const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');

// POST /api/v1/login
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen los datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Crear token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

// POST /api/v1/login/registro (opcional para crear usuarios)
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});
module.exports = router;