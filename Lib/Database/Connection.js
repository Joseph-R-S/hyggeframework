// Lib/Database/Connection.js
const Logger = require('../Logger/Logger');
const Env = require('../Config/Env'); 

class Connection {
  static #instance = null;

  static async getInstance() {
    if (!Connection.#instance) {
      // 1. Lectura desde el objeto centralizado Env (en lugar de process.env)
      const type = process.env.DB_TYPE; // DB_TYPE puede ser dinámico según la BD usada
      const host = Env.DB.HOST;
      const portEnv = Env.DB.PORT;
      const name = Env.DB.NAME;
      const user = Env.DB.USER;
      const pass = Env.DB.PASS;

      if (!type) {
        throw new Error('La variable de entorno DB_TYPE no está definida en el archivo .env');
      }

      Logger.info(`Inicializando conexión a base de datos de tipo: [${type}]`);

      switch (type.toLowerCase()) {
        case 'sqlite': {
          const Database = require('better-sqlite3');
          const path = require('path');
          const fs = require('fs');
          
          const dbPath = path.resolve(name || 'database.sqlite');
          const dir = path.dirname(dbPath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const db = new Database(dbPath);
          db.pragma('foreign_keys = ON');

          Connection.#instance = {
            driver: 'sqlite',
            async query(sql, params = []) {
              const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
              const stmt = db.prepare(sql);

              if (isSelect) {
                const rows = stmt.all(...params);
                return [rows];
              } else {
                const result = stmt.run(...params);
                return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
              }
            },
            async close() {
              db.close();
            },
            getNativeConnection() { return db; }
          };

          break;
        }

        case 'mysql': {
          const mysql = require('mysql2/promise');

          const connection = await mysql.createConnection({
            host,
            port: portEnv || 3306,
            user,
            password: pass,
            database: name,
          });

          Connection.#instance = {
            driver: 'mysql',
            async query(sql, params = []) {
              const [result] = await connection.query(sql, params);

              if (Array.isArray(result)) {
                return [result];
              }
              return [{ insertId: result.insertId, affectedRows: result.affectedRows }];
            },
            async close() {
              await connection.end();
            },
            getNativeConnection() { return connection; }
          };
          break;
        }

        case 'postgres':
        case 'postgresql': {
          const { Client } = require('pg');

          const client = new Client({
            host,
            port: portEnv || 5432,
            user,
            password: pass,
            database: name,
          });

          await client.connect();

          Connection.#instance = {
            driver: 'postgres',
            async query(sql, params = []) {
              let paramIndex = 1;
              const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
              const res = await client.query(pgSql, params);

              if (sql.trim().toUpperCase().startsWith('SELECT')) {
                return [res.rows];
              }
              return [{ insertId: res.rows[0]?.id || null, affectedRows: res.rowCount }];
            },
            async close() {
              await client.end();
            },
            getNativeConnection() { return client; }
          };
          break;
        }

        default:
          throw new Error(`Motor de base de datos no soportado: ${type}`);
      }
    }

    return Connection.#instance;
  }

  static async close() {
    if (Connection.#instance) {
      await Connection.#instance.close();
      Connection.#instance = null;
    }
  }
}

module.exports = Connection;