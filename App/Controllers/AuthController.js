// App/Controllers/AuthController.js
const BaseController = require('../../Lib/Controller/BaseController');
const UserTransformer = require('../Transformers/UserTransformer');

class AuthController extends BaseController {
  /**
   * @param {AuthService} authService 
   */
  constructor(authService) {
    super();
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Ejecutar la autenticación en el servicio
      const result = await this.authService.login(email, password);

      if (!result) {
        return this.badRequest(res, 'Credenciales inválidas: email o contraseña incorrectos');
      }

      // 2. Aplicar el Transformer al usuario autenticado
      const respuestaFormateada = {
        token: result.token,
        usuario: UserTransformer.transform(result.usuario)
      };

      // 3. Responder con el contrato público limpio
      return this.success(res, respuestaFormateada, 'Autenticación exitosa');
    } catch (error) {
      return this.internalError(res, error);
    }
  }
}

module.exports = AuthController;