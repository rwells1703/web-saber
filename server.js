const express = require("express");
const fs = require("node:fs");
const https = require("node:https");
const { Server } = require("socket.io");

const app = express();

app.get("/display", (req, res) => {
  res.sendFile(__dirname + "/webroot/display.html");
});

app.get("/display_debug", (req, res) => {
  res.sendFile(__dirname + "/webroot/display_debug.html");
});

app.get("/phone", (req, res) => {
  res.sendFile(__dirname + "/webroot/phone.html");
});

app.use("/libraries", express.static("libraries"));
app.use("/textures", express.static("textures"));
app.use("/sounds", express.static("sounds"));

var server = https.createServer(
  {
    key: fs.readFileSync("./certificates//server.key"),
    cert: fs.readFileSync("./certificates//server.cert"),
  },
  app,
);

const io = new Server(server, {});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("orientation", (orientation) => {
    io.emit("orientation", orientation);
  });

  socket.on("calibrate", () => {
    io.emit("calibrate");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
