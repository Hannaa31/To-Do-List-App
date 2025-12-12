const pool = require("../db");

module.exports = async (req, res, next) => {
  try {
    const user = await pool.query("SELECT role FROM users WHERE user_id = $1", [req.user]);
    
    if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
      return res.status(403).json("Access Denied: Admins Only");
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};