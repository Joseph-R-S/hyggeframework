// Lib/Middleware/SchemaValidator.js
const BaseController = require('../Controller/BaseController');

class SchemaValidator extends BaseController {
  /**
   * Recibe un esquema con las reglas y devuelve un Middleware de Express.
   * @param {Object} schema - Objeto con las reglas de validación.
   * @param {String} source - Origen de los datos ('body', 'query', 'params'). Por defecto 'body'.
   */
  static validate(schema, source = 'body') {
    const instance = new SchemaValidator();

    return (req, res, next) => {
      const errors = [];
      const dataSource = req[source] || {};

      if (!schema || Object.keys(schema).length === 0) {
        console.log('ADVERTENCIA: El esquema enviado está vacío o es undefined.');
        return next();
      }

      for (const field in schema) {
        const rules = schema[field];
        const value = dataSource[field];

        // 1. Validar campo obligatorio
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`El campo '${field}' es obligatorio.`);
          continue;
        }

        // Si el campo no se envió y no es obligatorio, omitir las siguientes reglas
        if (value === undefined || value === null || value === '') continue;

        // 2. Validar tipo 'date' (Fechas formato YYYY-MM-DD e inexistencia de días falsos)
        if (rules.type === 'date') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          
          if (typeof value !== 'string' || !dateRegex.test(value)) {
            errors.push(`El campo '${field}' debe tener el formato de fecha YYYY-MM-DD.`);
            continue;
          }

          const [year, month, day] = value.split('-').map(Number);
          const dateObj = new Date(year, month - 1, day);

          if (
            dateObj.getFullYear() !== year ||
            dateObj.getMonth() + 1 !== month ||
            dateObj.getDate() !== day
          ) {
            errors.push(`El campo '${field}' contiene una fecha inválida (ej. día inexistente en el mes).`);
            continue;
          }
        } 
        // 3. Validar otros tipos de datos (string, number, boolean, etc.)
        else if (rules.type && typeof value !== rules.type) {
          errors.push(`El campo '${field}' debe ser de tipo ${rules.type}.`);
        }

        // 4. Validar longitud mínima (para cadenas de texto)
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
          errors.push(`El campo '${field}' debe tener al menos ${rules.minLength} caracteres.`);
        }

        // 5. Validar longitud máxima (para cadenas de texto)
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
          errors.push(`El campo '${field}' no puede superar los ${rules.maxLength} caracteres.`);
        }

        // 6. Validar valores permitidos (Enum)
        if (rules.enum && Array.isArray(rules.enum) && !rules.enum.includes(value)) {
          errors.push(`El campo '${field}' debe ser uno de los siguientes valores: ${rules.enum.join(', ')}.`);
        }

        // 7. Validar formato mediante expresión regular (Regex)
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