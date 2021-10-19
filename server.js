/*require('dotenv').config();
const historyApiFallback = require('connect-history-api-fallback');
const path = require('path');
const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');
const signinRoute = require("./routes/api/signin");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.urlencoded());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "API running..." });
  });
  
app.use("/api", signinRoute);


const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server running on port ${PORT} `));



module.exports = app;*/

const connectDB=require('./config/db');
require('dotenv').config();
const express=require('express');
const cors =require("cors");

connectDB();
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const signinRoute = require("./routes/api/signin");

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});
app.use("/api", signinRoute);


//Routes

const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`server running on port ${PORT} `));