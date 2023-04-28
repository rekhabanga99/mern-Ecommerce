const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  user.save().then((data) => {
    console.log("Register api", data);
    res.send(data);
  });
});

app.post("/login", async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  if (req.body.email && req.body.password) {
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "No user found" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  product.save().then((data) => {
    console.log("add product api", data);
    res.send(data);
  });
});
app.get("/products", async (req, res) => {
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
app.delete("/delete/:id", async (req, res) => {
  let products = await Product.deleteOne({ _id: req.params.id });
  if (products?.acknowledged) {
    res.send(products);
  } else {
    res.send({ result: "Delete failed" });
  }
});

app.get("/search/:key", async (req, res) => {
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
app.listen(5000, () => console.log("server is runninng at 5000"));
