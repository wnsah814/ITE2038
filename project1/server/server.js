const express = require("express");
const app = express();

const student = require("./routes/student");
const course = require("./routes/course");

app.use("/api", student);
app.use("/api", course);
const port = 4000;
app.listen(port, () => console.log(`${port}`));
