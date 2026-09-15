// App/Routes/AuthRouter.js
const { Router } = require('express');
const SchemaValidator = require('../../Lib/Middleware/SchemaValidator');
const { loginSchema } = require('../Schemas/AuthSchema');
const { loginLimiter } = require('../Middlewares/RateLimitMiddleware');

function createAuthRouter(authController) {
  const router = Router();

  // POST /auth/login
  router.post(
    '/login',
    loginLimiter,
    SchemaValidator.validate(loginSchema),
    (req, res) => authController.login(req, res)
  );

  return router;
}

module.exports = createAuthRouter;