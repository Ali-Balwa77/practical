require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const ejs = require('ejs');
require('./src/db/conn');
const cookieParser = require('cookie-parser');
const emprouter = require('./src/router/emp');

const port = process.env.PORT || 8080

const static_path = path.join(__dirname,"public")

app.use(express.json())
app.use(cookieParser())
app.use(emprouter)
app.use(express.static(static_path))
app.set("view engine", 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.listen(port,() =>{
    console.log(`server is running at port no ${port}`)
})