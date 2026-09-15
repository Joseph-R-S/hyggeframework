// App/Services/UserService.js
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Criteria = require('../../Lib/Database/Criteria');

class UserService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async obtenerUsuarioPorId(id) {
    return await this.usuarioRepository.find(id);
  }

  async crearUsuario(datos) {
    // Regla de negocio: Verificar si el email ya existe usando Criteria
    const criteria = new Criteria();
    criteria.add('email', '=', datos.email);

    const usuarioExistente = await this.usuarioRepository.findOneByCriteria(criteria);

    if (usuarioExistente) {
      throw new Error(`El email ${datos.email} ya está registrado en el sistema`);
    }

    if (datos.password) {
      const SALT_ROUNDS = 10;
      datos.password = await bcrypt.hash(datos.password, SALT_ROUNDS);
    }

    const UsuarioModel = this.usuarioRepository.RecordClass;
    const nuevoUsuario = new UsuarioModel(datos);

    return await this.usuarioRepository.save(nuevoUsuario);
  }

  async eliminarUsuarioPorId(id) {
    // 1. Buscar si el usuario 
    const usuario = await this.usuarioRepository.find(id);

    if (!usuario) {
      return null; // El usuario no existe
    }

    // 2. Proceder a eliminar el registro de la BD
    await this.usuarioRepository.delete(id);

    // 3. Devolver los datos del usuario que fue eliminado para confirmación
    return usuario;
  }

  //actualiza el avatar de un usuario
  async updateAvatar(userId, avatarUrl) {
    const user = await this.userRepository.find(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Si ya tenía un avatar previo, eliminar el archivo antiguo del disco
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), 'public', user.avatar.replace('/uploads', 'uploads'));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // Borra el archivo viejo
      }
    }

    user.avatar = avatarUrl;
    return await this.userRepository.save(user);
  }
}

module.exports = UserService;