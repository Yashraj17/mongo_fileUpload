const express = require('express')
const router  = express.Router();

const homeController = require("../controllers/homeController")
const uploadController = require("../controllers/uploadController")

let routes = app => {

    router.post("/upload",uploadController.uploadFiles);
    router.get("/",uploadController.GetListImages);
    router.get("/files/:name",uploadController.download);
    return app.use("/",router)
}

module.exports = routes