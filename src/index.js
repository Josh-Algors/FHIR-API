const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
require('./config/db');

const authRouter = require("./routes/auth");
const logRouter = require("./routes/log");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    return res.status(200).json({});
  }

  next();
});

// Parse JSON bodies for all requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect(`http://localhost:${process.env.PORT}`);
});

//Cross origin fix
app.use(cors());

// app.use(limiter);

//Cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    return res.status(200).json({});
  }

  next();
});

app.use('/api/v1/', authRouter);
app.use('/api/v1/secure', logRouter);

app.use((err, req, res, next) => {

  return res.status(500).json({ 
    code: 500,
    status: 'ERROR',
    message: err.message
  });

});

app.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});