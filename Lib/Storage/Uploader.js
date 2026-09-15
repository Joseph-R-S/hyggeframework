// Lib/Storage/Uploader.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class Uploader {
  /**
   * Crea un middleware de Multer listo para usar
   * @param {Object} options Configuración de subida
   * @param {string} options.dest Ruta donde se guardarán los archivos
   * @param {number} options.maxFileSizeMB Tamaño máximo permitido en MB
   * @param {RegExp} options.allowedTypes Expresión regular para validar extensiones
   */
  static create({ 
    dest = 'public/uploads', 
    maxFileSizeMB = 5, 
    allowedTypes = /jpeg|jpg|png|webp|pdf/ 
  } = {}) {
    
    // Garantiza que la carpeta de destino exista antes de guardar
    const uploadPath = path.resolve(process.cwd(), dest);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadPath),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    });

    return multer({
      storage,
      limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isValid = allowedTypes.test(ext);

        if (isValid) {
          return cb(null, true);
        }
        cb(new Error(`Tipo de archivo no permitido. Formatos aceptados: ${allowedTypes}`));
      }
    });
  }
}

module.exports = Uploader;