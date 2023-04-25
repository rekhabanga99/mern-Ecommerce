const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/Users");
const app = express();

app.use(express.json());
app.use(cors())

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  user.save().then((data) => {
    console.log("Register api", data);
    res.send(data);
  });
});

app.listen(5000, () => console.log("server is runninng at 5000"));
