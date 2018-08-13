const mongoose = require("mongoose");
const User = require("../models/User");
exports.search = async (req, res) => {
  const regex_value = new RegExp(req.body.key_word);
  const results = await User.find({
    name: regex_value
  });
  console.log(
    "Regex : " + regex_value + "Found user : " + results.map(user => user.name)
  );

  res.json(results);
};
