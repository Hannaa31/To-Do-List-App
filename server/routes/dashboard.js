const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const bcrypt = require("bcryptjs");

// GET DATA (User Profile + Todos)
router.get("/", authorization, async (req, res) => {
  try {
    const { name, filter } = req.query; 
    const user = await pool.query("SELECT username, role FROM users WHERE user_id = $1", [req.user]);
    let queryText = `SELECT * FROM todos WHERE user_id = $1`;
    const queryParams = [req.user];
    let paramCount = 1;

    if (name) {
      paramCount++;
      queryText += ` AND description ILIKE $${paramCount}`;
      queryParams.push(`%${name}%`);
    }

    if (filter === 'completed') queryText += ` AND is_completed = TRUE`;
    else if (filter === 'active') queryText += ` AND is_completed = FALSE`;

    queryText += ` ORDER BY created_at DESC`;

    const todos = await pool.query(queryText, queryParams);
    res.json({
        ...user.rows[0],
        todos: todos.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// CREATE TODO
router.post("/todos", authorization, async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (user_id, description) VALUES ($1, $2) RETURNING *",
      [req.user, description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// UPDATE TODO
router.put("/todos/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed, description } = req.body;
    
    if (description !== undefined) {
        await pool.query("UPDATE todos SET description = $1 WHERE todo_id = $2 AND user_id = $3", [description, id, req.user]);
        res.json("Todo description updated!");
    } else {
        await pool.query("UPDATE todos SET is_completed = $1 WHERE todo_id = $2 AND user_id = $3", [is_completed, id, req.user]);
        res.json("Todo status updated!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE TODO
router.delete("/todos/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE todo_id = $1 AND user_id = $2", [id, req.user]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

// UPDATE USER PROFILE (Name & Password)
router.put("/user", authorization, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);
            await pool.query("UPDATE users SET username = $1, password = $2 WHERE user_id = $3", [username, bcryptPassword, req.user]);
        } else {
            await pool.query("UPDATE users SET username = $1 WHERE user_id = $2", [username, req.user]);
        }
        res.json("Profile updated");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;