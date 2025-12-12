const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/auth"));

app.use("/dashboard", require("./routes/dashboard"));

app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});