// App/Routes/UserRouter.js
const { Router } = require('express');
const SchemaValidator = require('../../Lib/Middleware/SchemaValidator');
const { AuthMiddleware } = require('../../Lib/Middleware/AuthMiddleware');
const { createUserSchema } = require('../Schemas/UserSchema');
const Uploader = require('../../Lib/Storage/Uploader');

// Middleware para procesar la subida del avatar
const uploadAvatar = Uploader.create({ dest: 'public/uploads/avatars' }).single('avatar');

function createUserRouter(userController) {
  const router = Router();

  // GET /usuarios/:id -> Obtener usuario por ID (Protegido)
  router.get(
    '/:id',
    AuthMiddleware.authenticate(),
    (req, res) => userController.getById(req, res)
  );

  // POST /usuarios -> Crear un nuevo usuario (JSON)
  router.post(
    '/',
    SchemaValidator.validate(createUserSchema),
    (req, res) => userController.create(req, res)
  );

  // POST /usuarios/avatar -> Subir imagen de avatar (Multipart/Form-data)
  router.post(
    '/avatar',
    AuthMiddleware.authenticate(), // Extrae el token y guarda los datos del usuario en req.user
    uploadAvatar,                  // Guarda el archivo en disk
    (req, res) => userController.uploadAvatar(req, res)
  );

  // DELETE /usuarios/:id -> Eliminar usuario (Protegido)
  router.delete(
    '/:id',
    AuthMiddleware.authenticate(),
    (req, res) => userController.delete(req, res)
  );

  return router;
}

module.exports = createUserRouter;