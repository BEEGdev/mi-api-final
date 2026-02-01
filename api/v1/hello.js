const express = require('express');
const router = express.Router();

// GET /api/v1/hello
router.get('/', (req, res) => {
  res.json({ mensaje: 'Hola Mundo' });
});

module.exports = router;