// Lib/Config/EnvValidator.js
const Logger = require('../Logger/Logger');

class EnvValidator {
  /**
   * Inspecciona las variables del .env y aborta la ejecución si falta alguna obligatoria
   * @param {Array<string>} requiredVars Variables de entorno requeridas
   */
  static validate(requiredVars = []) {
    const missing = requiredVars.filter(key => !process.env[key] || process.env[key].trim() === '');

    if (missing.length > 0) {
      Logger.error('🔥 ERROR CRÍTICO DE CONFIGURACIÓN: Faltan variables de entorno obligatorias:');
      missing.forEach(variable => {
        Logger.error(`   ❌ [MISSING]: ${variable}`);
      });
      Logger.error('Ejecución detenida. Por favor, define todas las claves faltantes en tu archivo .env.');
      
      process.exit(1);
    }

    Logger.info('Variables de entorno validadas correctamente.');
  }
}

module.exports = EnvValidator;