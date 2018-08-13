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
const chat = require("./controller/chatController.js");

// var server = require("http").Server(app);
// var io = require("socket.io")(server);
// server.listen(5000, function() {
//   console.log(`Server up and running on port ${server.address().port}`);
// });

// io.on("connection", function(socket) {
//   console.log("user connected");
//   socket.emit("currentUser", {});
//   chat.connected(socket);
//   socket.on("disconnect", function() {
//     chat.disconnected(socket);
//   });
//   socket.on("namechanged", function(data) {
//     chat.namechanged(socket, data);
//   });
//   socket.on("message", function(data) {
//     chat.sendmessage(socket, data);
//   });
// });
