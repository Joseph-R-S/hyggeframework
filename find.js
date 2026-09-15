const Connection = require('./Lib/Database/Connection');
const Criteria = require('./Lib/Database/Criteria');
const Record = require('./Lib/Database/Record');
const Repository = require('./Lib/Database/Repository');
const Transaction = require('./Lib/Database/Transaction');

const db = Connection.getInstance();

class Usuario extends Record {
  saludar() {
    return `Hola, mi nombre es ${this.nombre}`;
  }
}

const usuarioRepo = new Repository(db, 'usuarios', Usuario);

// --- 1. BUSCAR POR ID (find) ---
const usuario = usuarioRepo.find(2);

if (usuario) {
  console.log(usuario.saludar()); // Instancia completa de Usuario
} else {
  console.log('Usuario no encontrado');
}

// --- 2. BUSCAR UNO POR CRITERIA (findOneByCriteria) ---
const criteriaEmail = new Criteria().add('email', '=', 'joseph@ejemplo.com');
const usuarioEncontrado = usuarioRepo.findOneByCriteria(criteriaEmail);

//console.log(usuarioEncontrado.email);
// --- 3. OBTENER TODOS (all) ---
const todosLosUsuarios = usuarioRepo.all();
console.log(`Total usuarios: ${todosLosUsuarios.length}`);