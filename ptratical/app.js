
const express = require("express");
const app = express();
const hbs = require('hbs');
const path = require('path');
const registerRouter = require('./src/router/index')
require('dotenv').config()
const port = process.env.PORT || 5000;
require('./src/db/conn');
const static_path = path.join(__dirname, "public")
const template_path = path.join(__dirname, "templates/views")
const partials_path = path.join(__dirname, "templates/partials")

console.log(template_path)

app.use(express.json())
app.use(registerRouter)
app.use(express.static(static_path))
app.set("view engine", 'hbs')
app.set("views", template_path)
hbs.registerPartials(partials_path)


app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})