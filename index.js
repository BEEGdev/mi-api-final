const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/database');

// Importar rutas
const helloRoute = require('./api/v1/hello');
const saludoRoute = require('./api/v1/saludo');
const usuariosRoute = require('./api/v1/usuarios');
const loginRoute = require('./api/v1/login');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Documentación con Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/api/v1/hello', helloRoute);
app.use('/api/v1/saludo', saludoRoute);
app.use('/api/v1/usuarios', usuariosRoute);
app.use('/api/v1/login', loginRoute);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a mi API REST',
        documentacion: '/api-docs'
    });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;