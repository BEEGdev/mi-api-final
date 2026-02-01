const express = require('express');
const router = express.Router();

// GET /api/v1/saludo/:nombre
router.get('/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.json({ mensaje: `Hola, ${nombre}!` });
});

module.exports = router;