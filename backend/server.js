const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Configure dotenv
dotenv.config();

//Connect to DB
mongoose.connect(
  process.env.MONGOOSE_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB Connected...")
);

//JSON Parser
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/recipes", require("./routes/api/recipe"));
app.use("/api/profile", require("./routes/api/profile"));

const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Server Running on port ${Port}`));
