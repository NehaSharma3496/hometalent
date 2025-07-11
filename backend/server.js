const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sequelize = require('./app/config/db.config');
const routes = require('./app/routes');
const path = require('path');

const app = express();

//test
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };

const corsOptions = {
  origin: ["http://localhost:3002", "*"],
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/media', express.static(path.join(__dirname, 'app/media')));

const PORT = process.env.PORT || 9999;



app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

app.use(routes);

sequelize.sync({ force: false })
  .then(async () => {
    console.log("Database & tables created!");
    // await seedAll();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));
