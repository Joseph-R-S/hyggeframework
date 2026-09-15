const express = require('express');
const Connection = require('./Lib/Database/Connection');
const Repository = require('./Lib/Database/Repository');
const Record = require('./Lib/Database/Record');
const UserService = require('./App/Services/UserService');
const UserController = require('./App/Controllers/UserController');

class Usuario extends Record {}

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // 1. Inicializar Persistencia (Tu ORM / Connection)
  const connection = await Connection.getInstance();
  const usuarioRepo = new Repository(connection, 'usuarios', Usuario);

  // 2. Inyección de Dependencias
  const userService = new UserService(usuarioRepo);
  const userController = new UserController(userService);

  // 3. Rutas de la API
  app.get('/usuarios/:id', (req, res) => userController.getById(req, res));
  app.post('/usuarios', (req, res) => userController.create(req, res));

  // 4. Iniciar Servidor
  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
}

bootstrap().catch(console.error);