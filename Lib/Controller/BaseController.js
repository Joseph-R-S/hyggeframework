// Lib/Controller/BaseController.js
const Logger = require('../Logger/Logger');

class BaseController {
  /**
   * Respuesta estándar de éxito (200 OK)
   */
  success(res, data = null, message = 'Operación realizada con éxito') {
    return this.#sendResponse(res, 200, {
      success: true,
      message,
      data
    });
  }

  /**
   * Respuesta de recurso creado (201 Created)
   */
  created(res, data = null, message = 'Recurso creado con éxito') {
    return this.#sendResponse(res, 201, {
      success: true,
      message,
      data
    });
  }

  /**
   * Error de cliente: Datos de entrada inválidos (400 Bad Request)
   */
  badRequest(res, message = 'Petición inválida o datos incompletos', errors = null) {
    return this.#sendResponse(res, 400, {
      success: false,
      message,
      errors
    });
  }

  /**
   * Error de cliente: Recurso no encontrado (404 Not Found)
   */
  notFound(res, message = 'El recurso solicitado no existe') {
    return this.#sendResponse(res, 404, {
      success: false,
      message
    });
  }

  /**
   * Error interno del servidor (500 Internal Server Error)
   */
  internalError(res, error, message = 'Error interno del servidor') {
    Logger.error(`[HTTP 500] ${message}`, { error: error.message, stack: error.stack });

    return this.#sendResponse(res, 500, {
      success: false,
      message,
      // Solo enviamos detalles técnicos en entornos de desarrollo
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  /**
   * Método privado para enviar la respuesta HTTP formateada
   */
  #sendResponse(res, statusCode, payload) {
    // Si res es un objeto de Express/Fastify/HTTP nativo
    if (typeof res.status === 'function') {
      return res.status(statusCode).json(payload);
    }

    // Soporte para módulo HTTP nativo de Node.js
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(payload));
  }
}

module.exports = BaseController;