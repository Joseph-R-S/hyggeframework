// Lib/Middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');
const BaseController = require('../Controller/BaseController');

// Clave secreta para firmar tokens (En producción se lee de process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_fallback_desarrollo';

class AuthMiddleware extends BaseController {
  /**
   * Middleware para verificar que la petición contenga un JWT válido en los Headers
   */
  static authenticate() {
    const instance = new AuthMiddleware();

    return (req, res, next) => {
      // 1. Obtener el encabezado 'Authorization'
      const authHeader = req.headers['authorization'];

      // El formato esperado es: "Bearer <token>"
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return instance.#unauthorized(res, 'Acceso denegado: No se proporcionó un token de autenticación');
      }

      // Extraer únicamente la cadena del token
      const token = authHeader.split(' ')[1];

      try {
        // 2. Verificar la firma y vigencia del Token
        const decodedPayload = jwt.verify(token, JWT_SECRET);

        // 3. Adjuntar la información del usuario autenticado a la petición (req.user)
        req.user = decodedPayload;

        // Pasar al siguiente middleware o controlador
        next();
      } catch (error) {
        return instance.#unauthorized(res, 'Acceso denegado: Token inválido o expirado');
      }
    };
  }

  /**
   * Respuesta privada para estado 401 Unauthorized
   */
  #unauthorized(res, message) {
    if (typeof res.status === 'function') {
      return res.status(401).json({
        success: false,
        message
      });
    }
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message }));
  }
}

module.exports = { AuthMiddleware, JWT_SECRET };