const express = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const JwtKey = "e-comm";
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  user.save().then((data) => {
    if (data) {
      Jwt.sign({ data }, JwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "Something went wrong" });
        }
        res.send({ user: data, auth: token });
      });
    }
  });
});

app.post("/login",async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  if (req.body.email && req.body.password) {
    if (user) {
      if (user) {
        Jwt.sign({ user }, JwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.send({ result: "Something went wrong" });
          }
          res.send({ user, auth: token });
        });
      }
    } else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "No user found" });
  }
});

app.post("/add-product",verifyToken, async (req, res) => {
  let product = new Product(req.body);
  product.save().then((data) => {
    console.log("add product api", data);
    res.send(data);
  });
});
app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find({});
  if (products?.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Product found" });
  }
});
app.get("/product/:id", async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.send({ result: "No Product found" });
  }
});
app.delete("/delete/:id", verifyToken,async (req, res) => {
  let products = await Product.deleteOne({ _id: req.params.id });
  if (products?.acknowledged) {
    res.send(products);
  } else {
    res.send({ result: "Delete failed" });
  }
});

app.get("/search/:key",verifyToken, async (req, res) => {
  let products = await Product.find({
    $or: [
      { name: req.params.key },
      { category: req.params.key },
      { company: req.params.key },
    ],
  });
  if (products?.length > 0) {
    res.send({ data: products, result: "Product found" });
  } else {
    res.send({ data: [], result: "No Product found" });
  }
});
function verifyToken(req, res, next) {

  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, JwtKey, (error, valid) => {
      if (error) {
        return res.status(401).send({ result: "Please enter valid token" });
      } else {
        next();
      }
    });
  } else {
    return res.status(403).send({ result: "Please add token with header" });
  }
}
app.listen(5000, () => console.log("server is runninng at 5000"));
