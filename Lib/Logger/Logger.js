// Lib/Logger/Logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  // Guarda el log en la raíz del proyecto (fuera de Lib/)
  static #logFilePath = path.resolve(process.cwd(), 'app.log');

  static DEBUG = 'DEBUG';
  static INFO  = 'INFO';
  static WARN  = 'WARN';
  static ERROR = 'ERROR';

  static log(level, message, context = null) {
    const timestamp = new Date().toISOString();
    const contextString = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const logLine = `[${timestamp}] [${level}] ${message}${contextString}\n`;

    // 1. Mostrar en consola
    console.log(logLine.trim());

    // 2. Guardar en archivo app.log (protegido con try/catch)
    try {
      fs.appendFileSync(Logger.#logFilePath, logLine, 'utf8');
    } catch (err) {
      console.error('Error al escribir en el archivo de log:', err.message);
    }
  }

  static debug(message, context) {
    Logger.log(Logger.DEBUG, message, context);
  }

  static info(message, context) {
    Logger.log(Logger.INFO, message, context);
  }

  static warn(message, context) {
    Logger.log(Logger.WARN, message, context);
  }

  static error(message, context) {
    Logger.log(Logger.ERROR, message, context);
  }
}

module.exports = Logger;