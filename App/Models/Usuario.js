const Connection = require('../../Lib/Database/Connection');
const Criteria = require('../../Lib/Database/Criteria');
const Record = require('../../Lib/Database/Record');
const Repository = require('../../Lib/Database/Repository');
const Transaction = require('../../Lib/Database/Transaction');

const db = Connection.getInstance();

// Entidad de Dominio limpia
class Usuario extends Record {}

// Repositorio para la entidad Usuario
class UsuarioRepository extends Repository {
  constructor(connection) {
    super(connection, 'usuarios', Usuario);
  }
}

// --- USO ---
const userRepo = new UsuarioRepository(db);
const trx = new Transaction(db);

// 1. Uso con Criteria
const criteria = new Criteria()
  .add('email', '=', 'joseph@ejemplo.com');

const usuarios = userRepo.findByCriteria(criteria);

// 2. Uso con Transaction
trx.execute(() => {
  const nuevoUsuario = new Usuario({ nombre: 'Elohim', email: 'elohim@ejemplo.com' });
  userRepo.save(nuevoUsuario);
});