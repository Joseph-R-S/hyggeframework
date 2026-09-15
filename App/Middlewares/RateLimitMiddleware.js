// App/Middlewares/RateLimitMiddleware.js
const RateLimiter = require('../../Lib/Middleware/RateLimiter');

// Regla de infraestructura configurada para la app
const loginLimiter = RateLimiter.create({
  minutes: 1,
  max: 5,
  message: 'Demasiados intentos de inicio de sesión. Reintenta en un minuto.'
});

const apiLimiter = RateLimiter.create({
  minutes: 15,
  max: 100,
  message: 'Has alcanzado el límite de peticiones de la API.'
});

module.exports = {
  loginLimiter,
  apiLimiter
};