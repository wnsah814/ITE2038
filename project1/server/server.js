const express = require("express");
const app = express();

const login = require("./routes/login");

const getClass = require("./routes/getClass");

const wantQuery = require("./routes/want");

const applyQuery = require("./routes/apply");

const deleteTable = require("./routes/delete");
const classControl = require("./routes/classControl");

const statistic = require("./routes/statistic");

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use("/api", login);
app.use("/api", getClass);
app.use("/api", wantQuery);
app.use("/api", applyQuery);
app.use("/api", deleteTable);
app.use("/api", classControl);
app.use("/api", statistic);
const port = 4000;
app.listen(port, () => console.log(`Running server on port ${port}`));
