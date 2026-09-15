// Lib/Middleware/SecurityMiddleware.js
const helmet = require('helmet');
const cors = require('cors');

class SecurityMiddleware {
  /**
   * Configura las cabeceras de seguridad HTTP con Helmet
   */
  static helmet() {
    return helmet();
  }

  /**
   * Configura el control de acceso CORS
   * @param {Array<string>|string} allowedOrigins Lista de orígenes permitidos
   */
  static cors(allowedOrigins = '*') {
    const corsOptions = {
      origin: (origin, callback) => {
        // Permitir peticiones sin origen (como clientes móviles, Postman o scripts servidor a servidor)
        if (!origin) return callback(null, true);

        if (allowedOrigins === '*' || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Acceso no permitido por la política de CORS'));
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    };

    return cors(corsOptions);
  }
}

module.exports = SecurityMiddleware;