const mongoose = require("mongoose");
const dummy = require("./controller/postController");
require("dotenv").config({ path: "variables.env" });

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true
  }
);
// Tell Mongoose to use ES6 promises
mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
// dummy.seedDB();
// require("./models/Post");
// require("./models/User");

const app = require("./app");

app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log(`Server up and running on port ${server.address().port}`);
});
