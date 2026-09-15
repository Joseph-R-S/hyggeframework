const Database = require('better-sqlite3');

// Se conecta a la base de datos (si el archivo no existe, lo crea automáticamente)
const db = new Database('mi_base_de_datos.db');

// Activar claves foráneas (buena práctica en SQLite)
db.pragma('foreign_keys = ON');

// 1. Crear una tabla de ejemplo si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

console.log('Base de datos inicializada correctamente.');

// 2. Insertar datos (usando Sentencias Preparadas para prevenir inyección SQL)
const insertStmt = db.prepare('INSERT INTO usuarios (nombre, email) VALUES (?, ?)');

try {
  const resultado = insertStmt.run('Joseph', 'joseph@ejemplo.com');
  console.log('Usuario insertado con ID:', resultado.lastInsertRowid);
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    console.log('El email ya está registrado.');
  } else {
    console.error('Error al insertar:', error.message);
  }
}

// 3. Consultar todos los registros
const selectStmt = db.prepare('SELECT * FROM usuarios');
const usuarios = selectStmt.all(); // .all() devuelve un array con todos los resultados

console.log('Lista de usuarios:', usuarios);