const express = require("express");
const app = express();

// const selectAll = require("./routes/selectAll");
const login = require("./routes/login");
const getClass = require("./routes/getClass");

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use("/api", login);
app.use("/api", getClass);

const port = 4000;
app.listen(port, () => console.log(`Running server on port ${port}`));
