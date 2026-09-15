// App/Controllers/UserController.js
const BaseController = require('../../Lib/Controller/BaseController');

class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  // OBTENER TODOS LOS USUARIOS
  static async index(req, res) {
    try {
      const rawUsers = await UserModel.all();

      // Aplicamos el Transformer a la lista
      const data = UserTransformer.transformCollection(rawUsers);

      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /usuarios/:id
  async getById(req, res) {
    try {
      const id = req.params.id;
      const rawUser = await UserModel.find(id);

      if (!rawUser) {
        return this.notFound(res, `No se encontró el usuario con ID ${id}`);
      }

      return this.success(res, rawUser, 'Usuario obtenido correctamente');
    } catch (error) {
      return this.internalError(res, error);
    }
  }

  // POST /usuarios
  async create(req, res) {
    try {
      const { nombre, email, password, avatar } = req.body;

      // Validación previa de datos recibidos
      if (!nombre || !email || !password) {
        return this.badRequest(res, 'El nombre, email y password son obligatorios');
      }

      const nuevoUsuario = await this.userService.crearUsuario({ nombre, email, password, avatar });
      return this.created(res, nuevoUsuario, 'Usuario creado correctamente');
    } catch (error) {
      // Manejo de errores de reglas de negocio creadas en la Capa Service
      if (error.message.includes('ya está registrado')) {
        return this.badRequest(res, error.message);
      }
      return this.internalError(res, error);
    }
  }

  // DELETE /usuarios/:id
  async delete(req, res) {
    try {
      const id = req.params.id;
      const usuarioEliminado = await this.userService.eliminarUsuarioPorId(id);

      // Si el servicio devuelve null, significa que no existía el registro
      if (!usuarioEliminado) {
        return this.notFound(res, `No se encontró el usuario con ID ${id}`);
      }

      // Si se eliminó correctamente, devolvemos 200 OK con los datos confirmados
      return this.success(res, usuarioEliminado, 'Usuario eliminado correctamente');
    } catch (error) {
      return this.internalError(res, error);
    }
  }

  // Carrega um avatar com el ID del usuario desde el JWT
  async uploadAvatar(req, res) {
    try {
      // Validar que se haya subido un archivo
      if (!req.file) {
        return this.badRequest(res, 'No se ha adjuntado ningún archivo de imagen');
      }

      //Obtener el ID del usuario desde el JWT (req.user)
      const userId = req.user.id;

      //Construir la URL pública que se guardará en la BD
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      //Actualizar el registro del usuario en la Base de Datos mediante el servicio
      const updatedUser = await this.userService.updateAvatar(userId, avatarUrl);

      // Retornar la respuesta con el DTO/Transformer
      return this.success(
        res,
        UserTransformer.transform(updatedUser),
        'Avatar actualizado con éxito'
      );
    } catch (error) {
      return this.internalError(res, error);
    }
  }

}

module.exports = UserController;