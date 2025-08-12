const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./app/config/db.config");
const routes = require("./app/routes");
const path = require("path");
const http = require("http");
const socketManager = require("./app/socket/socketManager");

// const seedAll = require('./app/seeders');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketManager.initialize(server);

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
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Socket.IO server initialized on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
