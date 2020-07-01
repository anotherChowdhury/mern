const http = require("http");
const app = require("./app");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});
const port = process.env.PORT || 5000;
app.io = io;

io.on("connection", (client) => {
  console.log("New client connected :" + client.id);
  client.emit("id", client.id);
  client.on("disconnect", (id) => {
    client.disconnect(true);
    console.log("Client disconnected" + id);
  });
});

// console.log(io.sockets.clients());

server.listen(port);
console.log(port);

module.exports = io;
