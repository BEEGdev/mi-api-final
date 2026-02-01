const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();

  } catch (error) {
    res.status(401).json({ 
      error: 'Token inválido',
      detalle: error.message 
    });
  }
};

module.exports = verificarToken;