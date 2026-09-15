// Lib/Database/Repository.js
const Logger = require('../Logger/Logger');

class Repository {
  constructor(connection, tableName, recordClass) {
    this.db = connection;
    this.tableName = tableName;
    this.RecordClass = recordClass;
  }

  // Helper interno para ejecutar consultas SQL de forma agnóstica al driver
  async #executeQuery(sql, params = []) {
    Logger.debug(`[SQL EXEC] ${sql}`, { params });
    const [result] = await this.db.query(sql, params);

    // Si es una consulta de lectura (Array de filas)
    if (Array.isArray(result)) {
      return { rows: result };
    }

    // Si es una consulta de escritura (INSERT / UPDATE / DELETE)
    return {
      affectedRows: result.affectedRows ?? 0,
      insertId: result.insertId ?? null
    };
  }

  // 1. Buscar por ID único
  async find(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const { rows } = await this.#executeQuery(sql, [id]);
    return rows && rows.length > 0 ? new this.RecordClass(rows[0]) : null;
  }

  // 2. Obtener todos los registros
  async all() {
    const sql = `SELECT * FROM ${this.tableName}`;
    const { rows } = await this.#executeQuery(sql);
    return rows.map(row => new this.RecordClass(row));
  }

  // 3. Buscar múltiples registros por Criteria
  async findByCriteria(criteria) {
    const sql = `SELECT * FROM ${this.tableName} ${criteria.getWhereClause()}`;
    const { rows } = await this.#executeQuery(sql, criteria.params);
    return rows.map(row => new this.RecordClass(row));
  }

  // 4. Buscar el primer registro por Criteria
  async findOneByCriteria(criteria) {
    const sql = `SELECT * FROM ${this.tableName} ${criteria.getWhereClause()} LIMIT 1`;
    const { rows } = await this.#executeQuery(sql, criteria.params);
    return rows && rows.length > 0 ? new this.RecordClass(rows[0]) : null;
  }

  // 5. Paginación de registros
  async paginate(page = 1, limit = 10, criteria = null) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    const whereClause = criteria ? criteria.getWhereClause() : '';
    const params = criteria ? criteria.params : [];

    // 1. Obtener el total de registros para los metadatos
    const countSql = `SELECT COUNT(*) AS total FROM ${this.tableName} ${whereClause}`;
    const { rows: countRows } = await this.#executeQuery(countSql, params);
    const totalRecords = parseInt(countRows[0].total || countRows[0]['COUNT(*)'] || 0, 10);

    // 2. Consultar el bloque de registros solicitados
    const dataSql = `SELECT * FROM ${this.tableName} ${whereClause} LIMIT ? OFFSET ?`;
    const { rows } = await this.#executeQuery(dataSql, [...params, limitNum, offset]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    return {
      data: rows.map(row => new this.RecordClass(row)),
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        perPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  // 6. Guardar (INSERT / UPDATE)
  async save(record) {
    const keys = Object.keys(record).filter(key => key !== 'id');
    const values = keys.map(key => record[key]);
    let sql = '';

    if (!record.id) {
      const columns = keys.join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

      if (this.db.driver === 'postgres') {
        sql += ' RETURNING id';
      }
      
      const res = await this.#executeQuery(sql, values);
      record.id = res.insertId;
    } else {
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
      const params = [...values, record.id];

      await this.#executeQuery(sql, params);
    }

    return record;
  }

  // 7. Eliminar un registro
  async delete(record) {
    if (!record.id) return false;

    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const res = await this.#executeQuery(sql, [record.id]);

    if (res.affectedRows > 0) {
      record.id = null;
      return true;
    }
    return false;
  }

  // 8. Eliminar por Criteria
  async deleteByCriteria(criteria) {
    const whereClause = criteria.getWhereClause();
    if (!whereClause) {
      throw new Error("Por seguridad, no se puede ejecutar un DELETE sin un Criteria.");
    }

    const sql = `DELETE FROM ${this.tableName} ${whereClause}`;
    const res = await this.#executeQuery(sql, criteria.params);

    return res.affectedRows;
  }
}

module.exports = Repository;