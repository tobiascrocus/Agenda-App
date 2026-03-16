import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseSync('agenda_tareas.db');

let dbInitialized = false;

export const initDB = async () => {
  if (dbInitialized) return database;

  try {
    database.execSync(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );
      
      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categoria_id INTEGER,
        fecha TEXT,
        hora TEXT,
        realizada INTEGER DEFAULT 0,
        FOREIGN KEY(categoria_id) REFERENCES categorias(id)
      );
    `);

    const existingCategories = database.getAllSync('SELECT COUNT(*) as count FROM categorias;');
    if (existingCategories[0].count === 0) {
      database.execSync(`
        INSERT INTO categorias (id, nombre) VALUES 
        (1, 'Trabajo'),
        (2, 'Estudio'),
        (3, 'Personal');
      `);
    }

    console.log('Base de datos inicializada correctamente');
    dbInitialized = true;
    return database;
  } catch (error) {
    console.error('Error inicializando DB:', error);
    throw error;
  }
};

const ensureDB = async () => {
  if (!dbInitialized) await initDB();
  return database;
};

// ================= OPERACIONES CATEGORÍAS =================

export const obtenerCategorias = async () => {
  try {
    const db = await ensureDB();
    const result = db.getAllSync('SELECT * FROM categorias ORDER BY nombre;');
    return result;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
};

export const agregarCategoria = async (nombre) => {
  try {
    const db = await ensureDB();
    const result = db.runSync('INSERT INTO categorias (nombre) VALUES (?);', [nombre.trim()]);
    return result;
  } catch (error) {
    console.error('Error agregando categoría:', error);
    throw error;
  }
};

export const actualizarCategoria = async (id, nombre) => {
  try {
    const db = await ensureDB();
    const result = db.runSync('UPDATE categorias SET nombre = ? WHERE id = ?;', [nombre.trim(), id]);
    return result;
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const db = await ensureDB();
    const countResult = db.getFirstSync('SELECT COUNT(*) as count FROM tareas WHERE categoria_id = ?;', [id]);
    const count = countResult.count;

    if (count > 0) {
      throw new Error(`No se puede eliminar. Hay ${count} tarea(s) usando esta categoría.`);
    }

    const result = db.runSync('DELETE FROM categorias WHERE id = ?;', [id]);
    return result;
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    throw error;
  }
};

// ================= OPERACIONES TAREAS =================

export const obtenerTareas = async () => {
  try {
    const db = await ensureDB();
    const result = db.getAllSync(`
      SELECT t.*, c.nombre as categoria_nombre 
      FROM tareas t 
      LEFT JOIN categorias c ON t.categoria_id = c.id 
      ORDER BY t.realizada ASC, t.fecha ASC, t.hora ASC;
    `);
    return result;
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    throw error;
  }
};

export const agregarTarea = async (tarea) => {
  try {
    const db = await ensureDB();
    const { nombre, descripcion, categoria_id, fecha, hora } = tarea;

    const result = db.runSync(
      `INSERT INTO tareas (nombre, descripcion, categoria_id, fecha, hora, realizada) 
       VALUES (?, ?, ?, ?, ?, 0);`,
      [nombre.trim(), descripcion?.trim() || '', categoria_id, fecha, hora]
    );
    return result;
  } catch (error) {
    console.error('Error agregando tarea:', error);
    throw error;
  }
};

export const actualizarTarea = async (id, tarea) => {
  try {
    const db = await ensureDB();
    const { nombre, descripcion, categoria_id, fecha, hora } = tarea;

    const result = db.runSync(
      `UPDATE tareas 
       SET nombre = ?, descripcion = ?, categoria_id = ?, fecha = ?, hora = ? 
       WHERE id = ?;`,
      [nombre.trim(), descripcion?.trim() || '', categoria_id, fecha, hora, id]
    );
    return result;
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    throw error;
  }
};

export const eliminarTarea = async (id) => {
  try {
    const db = await ensureDB();
    const result = db.runSync('DELETE FROM tareas WHERE id = ?;', [id]);
    return result;
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    throw error;
  }
};

export const toggleTareaRealizada = async (id, realizada) => {
  try {
    const db = await ensureDB();
    const result = db.runSync(
      'UPDATE tareas SET realizada = ? WHERE id = ?;',
      [realizada ? 1 : 0, id]
    );
    return result;
  } catch (error) {
    console.error('Error alternando tarea:', error);
    throw error;
  }
};

// ================= ESTADÍSTICAS =================

export const obtenerEstadisticas = async () => {
  try {
    const db = await ensureDB();
    const result = db.getAllSync(`
      SELECT 
        c.id,
        c.nombre as categoria_nombre,
        COUNT(t.id) as total_tareas,
        SUM(CASE WHEN t.realizada = 1 THEN 1 ELSE 0 END) as tareas_completadas,
        CASE 
          WHEN COUNT(t.id) > 0 THEN 
            ROUND((SUM(CASE WHEN t.realizada = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id)))
          ELSE 0 
        END as porcentaje_completado
      FROM categorias c
      LEFT JOIN tareas t ON c.id = t.categoria_id
      GROUP BY c.id, c.nombre
      ORDER BY c.nombre;
    `);
    return result;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

export const obtenerTareaPorId = async (id) => {
  try {
    const db = await ensureDB();
    const result = db.getFirstSync(`
      SELECT t.*, c.nombre as categoria_nombre 
      FROM tareas t 
      LEFT JOIN categorias c ON t.categoria_id = c.id 
      WHERE t.id = ?;
    `, [id]);

    if (!result) {
      throw new Error('Tarea no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error obteniendo tarea por ID:', error);
    throw error;
  }
};