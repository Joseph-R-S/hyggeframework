// Lib/Middleware/ErrorHandler.js
const multer = require('multer');
const Logger = require('../Logger/Logger');

class ErrorHandler {
  /**
   * Express reconoce que es un middleware de error por recibir 4 parámetros
   */
  static handle(err, req, res, next) {
    // Registramos el error completo en el Logger del sistema
    Logger.error('[ERROR NO CONTROLADO]:', { 
      message: err.message, 
      stack: err.stack 
    });

    // Capturar errores específicos de Multer (ej: LIMIT_FILE_SIZE)
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' 
          ? 'El archivo es demasiado grande. El límite es de 5MB.' 
          : `Error al subir archivo: ${err.message}`
      });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrió un error interno en el servidor';

    const payload = {
      success: false,
      message: statusCode === 500 ? 'Error interno del servidor' : message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    };

    // Formateo de respuesta (Express o HTTP nativo)
    if (typeof res.status === 'function') {
      return res.status(statusCode).json(payload);
    }

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(payload));
  }
}

module.exports = ErrorHandler;