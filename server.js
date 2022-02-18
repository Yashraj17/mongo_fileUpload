const cors = require("cors")
const express = require('express')
const app = express()
const initRoutes = require("./src/routes/index")

var corsOption  = {
    origin: "http://localhost:8081",
}


app.set("view engine","pug")
app.set("views","./views");

app.use(cors(corsOption))
app.use(express.urlencoded({extended:true}))

initRoutes(app)

app.listen(8081)
 