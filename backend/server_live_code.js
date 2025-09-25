const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./app/config/db.config");
const routes = require("./app/routes");
const http = require("http");
const https = require('https');
const fs = require('fs');
const path = require('path');

const socketManager = require("./app/socket/socketManager");

// const seedAll = require('./app/seeders');

const app = express();
const server = http.createServer(app);

const socketIo = require("socket.io");
var privateKey = fs.readFileSync('../crt/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../crt/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const httpsserver = https.createServer(credentials, app);

// Initialize Socket.IO
 const io = socketManager.initialize(httpsserver);
//  const io = socketManager.initialize(server);


// live code 

// const io = socketIo(httpsserver, {
//   cors: {
//     origin: "*",
//     credentials: true
//   }
// });


io.on("connection", (socket) => {
   console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });


});


app.get("/test", (req, res) => {
  // console.log("io -- ",io)
   io.emit("testEvent", { message: "Hello from /test route LLLLLLLLLLLLL" });
  res.send("Welcome to my app --");
});

//test

// const corsOptions = {

// origin: "http://localhost:3000",

// credentials: true,

// };

const corsOptions = {
  // origin: ["http://localhost:3000", "*"],
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/media", express.static(path.join(__dirname, "app/media")));

const PORT = process.env.PORT || 9999;

app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

app.use(routes);

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("Database & tables created!");
    // await seedAll();
    httpsserver.listen(1001)
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Socket.IO server initialized on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
