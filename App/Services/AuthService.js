// App/Services/AuthService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const Env = require('../../Lib/Config/Env');

class AuthService {
  /**
   * @param {Repository} usuarioRepository 
   */
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async login(email, password) {
    // 1. Buscar el usuario en la BD por su correo
    const usuarios = await this.usuarioRepository.all();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return null; // Usuario no encontrado
    }

    // 2. Validar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);

    if (!esValida) {
      return null; // Contraseña incorrecta
    }

    // 3. Generar el Payload
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    };

    // 4. Firmar y retornar el Token usando la configuración centralizada de Env
    return jwt.sign(payload, Env.JWT_SECRET, {
      expiresIn: Env.JWT_EXPIRES_IN
    });
  }
}

module.exports = AuthService;