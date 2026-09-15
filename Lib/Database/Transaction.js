const Logger = require('../Logger/Logger');

class Transaction {
  constructor(connection) {
    this.db = connection;
  }

  async execute(callback) {
    Logger.info('Iniciando transacción');

    try {
      if (this.db.prepare) {
        // SQLite (better-sqlite3) - Requiere ejecución síncrona
        const trx = this.db.transaction((fn) => fn());
        const result = trx(callback);
        Logger.info('Transacción completada exitosamente (COMMIT)');
        return result;
      } else {
        // MySQL / PostgreSQL (vía sentencias SQL asíncronas)
        await this.db.query('START TRANSACTION');
        const result = await callback();
        await this.db.query('COMMIT');
        Logger.info('Transacción completada exitosamente (COMMIT)');
        return result;
      }
    } catch (error) {
      if (!this.db.prepare) {
        await this.db.query('ROLLBACK');
      }
      Logger.error('Fallo en la transacción, aplicando ROLLBACK', { error: error.message });
      throw error;
    }
  }
}

module.exports = Transaction;