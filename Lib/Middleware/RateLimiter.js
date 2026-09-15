// Lib/Middleware/RateLimiter.js
const rateLimit = require('express-rate-limit');

class RateLimiter {
  /**
   * Crea una instancia de Rate Limit configurable
   * @param {Object} options 
   * @param {number} options.minutes Ventana de tiempo en minutos
   * @param {number} options.max Peticiones máximas en esa ventana
   * @param {string} options.message Mensaje personalizado
   */
  static create({ minutes = 15, max = 100, message = 'Demasiadas peticiones' }) {
    return rateLimit({
      windowMs: minutes * 60 * 1000,
      max: max,
      message: {
        success: false,
        message: message
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }
}

module.exports = RateLimiter;