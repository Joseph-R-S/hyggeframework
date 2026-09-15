class Criteria {
  constructor() {
    this.conditions = [];
    this.params = [];
    this.limitValue = null;
    this.orderByField = null;
  }

  add(field, operator, value) {
    this.conditions.push(`${field} ${operator} ?`);
    this.params.push(value);
    return this; // Permite interfaz fluida (method chaining)
  }

  limit(limit) {
    this.limitValue = limit;
    return this;
  }

  getWhereClause() {
    return this.conditions.length > 0 
      ? `WHERE ${this.conditions.join(' AND ')}` 
      : '';
  }
}

module.exports = Criteria;