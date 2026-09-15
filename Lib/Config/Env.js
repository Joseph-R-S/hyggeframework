// Lib/Config/Env.js
require('dotenv').config();

const config = Object.freeze({
  // Servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  
  // Seguridad y JWT
  JWT_SECRET: process.env.JWT_SECRET || 'secret_key_default',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // Base de Datos
  DB: Object.freeze({
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 3306,
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASS || '',
    NAME: process.env.DB_NAME || 'database'
  }),

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173']
});

module.exports = config;