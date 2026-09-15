// App/Transformers/UserTransformer.js

class UserTransformer {
  /**
   * Transforma un único objeto/entidad Usuario en la estructura pública deseada
   */
  static transform(user) {
    if (!user) return null;

    return {
      id: Number(user.id),
      nombre: user.nombre || user.name || '',
      email: user.email || '',
      rol: user.rol || 'USER',
      activo: Boolean(user.activo ?? true),
      creadoEn: user.created_at ? new Date(user.created_at).toISOString() : null
      // La propiedad 'password' o 'pass' queda explícitamente EXCLUIDA
    };
  }

  /**
   * Transforma una lista (array) de usuarios
   */
  static transformCollection(users = []) {
    return users.map(user => UserTransformer.transform(user));
  }
}

module.exports = UserTransformer;