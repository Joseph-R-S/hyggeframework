const Connection = require('./Lib/Database/Connection');
const Repository = require('./Lib/Database/Repository');
const Record = require('./Lib/Database/Record');

class Usuario extends Record {}

async function main() {
  const db = await Connection.getInstance();
  const usuarioRepo = new Repository(db, 'usuarios', Usuario);

  // 1. Crear e insertar registro
  const nuevoUsuario = new Usuario({ nombre: 'David', email: 'david@example.com' });
  await usuarioRepo.save(nuevoUsuario);
  console.log('Usuario guardado con ID:', nuevoUsuario.id);

  // 2. Consultar el registro insertado
  const usuarioObtenido = await usuarioRepo.find(nuevoUsuario.id);
  console.log('Usuario recuperado de MySQL:', usuarioObtenido);
  await db.close();
}

main().catch(console.error);