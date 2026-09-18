// Lib/Middleware/SchemaValidator.js
const BaseController = require('../Controller/BaseController');

class SchemaValidator extends BaseController {
  /**
   * Recibe un esquema con las reglas y devuelve un Middleware de Express
   */
  static validate(schema) {
    const instance = new SchemaValidator();

    return (req, res, next) => {

      const errors = [];
      const body = req.body || {};
      const sanitizedBody = {};
      
      if (!schema || Object.keys(schema).length === 0) {
        console.log('ADVERTENCIA: El esquema enviado está vacío o es undefined.');
        return next();
      }

      for (const field in schema) {
        const rules = schema[field];
        const value = body[field];

        // 1. Validar campo obligatorio
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`El campo '${field}' es obligatorio.`);
          continue;
        }

        // Si el campo no se envió y no es obligatorio, omitir siguientes reglas
        if (value === undefined || value === null) continue;

        // 2. Validar tipo de dato
        if (rules.type && typeof value !== rules.type) {
          errors.push(`El campo '${field}' debe ser de tipo ${rules.type}.`);
        }

        // 3. Validar longitud mínima (para cadenas de texto)
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
          errors.push(`El campo '${field}' debe tener al menos ${rules.minLength} caracteres.`);
        }

        // 4. Validar formato mediante expresión regular (Regex)
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`El formato del campo '${field}' es inválido.`);
        }
      }


      // Si existen errores, se interrumpe el flujo y se devuelve HTTP 400
      if (errors.length > 0) {
        return instance.badRequest(res, 'Error de validación en los datos enviados', errors);
      }
      next();
    };
  }
}

module.exports = SchemaValidator;