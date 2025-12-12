const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const checkAdmin = require("../middleware/checkAdmin");

// Get All Users (Admin Only)
router.get("/users", authorization, checkAdmin, async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT u.user_id, u.username, u.email, u.role, COUNT(t.todo_id) as task_count 
      FROM users u 
      LEFT JOIN todos t ON u.user_id = t.user_id 
      GROUP BY u.user_id
    `);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a User (Admin Only)
router.delete("/users/:id", authorization, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;