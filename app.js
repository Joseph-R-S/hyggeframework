// app.js
require('dotenv').config();

const express = require('express');
const path = require('path');

// Librerías de Infraestructura (Lib/)
const Env = require('./Lib/Config/Env');
const EnvValidator = require('./Lib/Config/EnvValidator');
const Connection = require('./Lib/Database/Connection');
const Repository = require('./Lib/Database/Repository');
const Record = require('./Lib/Database/Record');
const ErrorHandler = require('./Lib/Middleware/ErrorHandler');
const SecurityMiddleware = require('./Lib/Middleware/SecurityMiddleware');

// Aplicación y Dominio (App/)
const UserService = require('./App/Services/UserService');
const UserController = require('./App/Controllers/UserController');
const createUserRouter = require('./App/Routes/UserRouter');
const AuthService = require('./App/Services/AuthService');
const AuthController = require('./App/Controllers/AuthController');
const createAuthRouter = require('./App/Routes/AuthRouter');
const { apiLimiter } = require('./App/Middlewares/RateLimitMiddleware');

class Usuario extends Record { }

async function bootstrap() {
  const app = express();

  //Validar 
  EnvValidator.validate([
    'PORT',
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_NAME'
  ]);

  // Seguridad y Proxies
  app.set('trust proxy', 1);
  app.use(SecurityMiddleware.helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173']; // Puertas comunes de React/Vite

  app.use(SecurityMiddleware.cors(allowedOrigins));

  // Middlewares Globales
  app.use(express.json());
  app.use(apiLimiter);

  //Servicio de Archivos Estáticos (Imágenes / Uploads)
  app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

  //Inicialización de Persistencia
  const connection = await Connection.getInstance();
  const usuarioRepo = new Repository(connection, 'usuarios', Usuario);

  // Módulo de Usuarios
  const userService = new UserService(usuarioRepo);
  const userController = new UserController(userService);
  app.use('/usuarios', createUserRouter(userController));

  // Módulo de Autenticación
  const authService = new AuthService(usuarioRepo);
  const authController = new AuthController(authService);
  app.use('/auth', createAuthRouter(authController));

  //Middleware de Manejo de Errores Global (Siempre al final)
  app.use(ErrorHandler.handle);

  //Arranque del Servidor HTTP
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});

