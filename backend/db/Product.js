const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  company: String,
  userId: String,
  category: String
});

module.exports = mongoose.model("userproducts", productSchema);
