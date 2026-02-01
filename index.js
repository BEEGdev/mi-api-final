const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const helloRoute = require('./api/v1/hello');
const saludoRoute = require('./api/v1/saludo');
const usuariosRoute = require('./api/v1/usuarios');
const loginRoute = require('./api/v1/login');

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Documentación con Swagger (con manejo de errores)
try {
  const swaggerDocument = YAML.load('./swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger disponible en /api-docs');
} catch (error) {
  console.log('Swagger no disponible:', error.message);
}

// Rutas
app.use('/api/v1/hello', helloRoute);
app.use('/api/v1/saludo', saludoRoute);
app.use('/api/v1/usuarios', usuariosRoute);
app.use('/api/v1/login', loginRoute);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Bienvenido a mi API REST',
    version: '1.0.0',
    endpoints: {
      hello: '/api/v1/hello',
      saludo: '/api/v1/saludo/:nombre',
      login: '/api/v1/login',
      registro: '/api/v1/login/registro',
      usuarios: '/api/v1/usuarios (requiere token)'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;