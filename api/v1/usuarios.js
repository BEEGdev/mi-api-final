const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');
const verificarToken = require('../../middleware/auth');

// GET /api/v1/usuarios - Protegido con JWT
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    
    res.json({
      total: usuarios.length,
      usuarios
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener usuarios',
      detalle: error.message 
    });
  }
});

module.exports = router;