const pool = require("../db/index.js");

// Crear tarea
const createTask = async (req, res) => {
  const { title, description, user_id, status } = req.body;

  try {
    // Validar campos requeridos
    if (!title || !user_id) {
      return res.status(400).json({ error: "Título y user_id son requeridos" });
    }

    // Validar estado válido
    const validStatus = ["pending", "completed"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    // Verificar existencia del usuario
    const userExists = await pool.query("SELECT id FROM users WHERE id = $1", [
      user_id,
    ]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, status || "pending", user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las tareas
const getTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tasks.*, users.name as user_name 
      FROM tasks 
      JOIN users ON tasks.user_id = users.id
      ORDER BY tasks.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener tarea por ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT tasks.*, users.name as user_name 
      FROM tasks 
      JOIN users ON tasks.user_id = users.id 
      WHERE tasks.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, user_id } = req.body;

  try {
    // Validar existencia de la tarea
    const taskExists = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    if (taskExists.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Validar estado válido
    const validStatus = ["pending", "completed"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    // Verificar usuario si se actualiza
    if (user_id) {
      const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
        user_id,
      ]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
    }

    const result = await pool.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        user_id = COALESCE($4, user_id)
      WHERE id = $5 RETURNING *`,
      [title, description, status, user_id, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
