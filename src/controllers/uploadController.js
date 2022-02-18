const upload  = require("../middleware/upload")
const dbConfig = require("../config/db");
const { GridFSBucket } = require("mongodb");
const MongoClient = require("mongodb").MongoClient
const gridFSBucket = require("mongodb").GridFSBucket
const url = dbConfig.url;
const baseUrl = "http:://localhost:8081/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req,res) => {
    try{
        await upload(req,res);
        console.log(req.file);

        if(req.file == undefined){
            return res.send({
                messege: "you must select a file ",
            }); 
        } 
        return res.redirect('/');
    }
    catch(error){
        console.log(error);
        return res.send({
            messege: "Error when trying to upload a image :" + error,
        })
    }
};

const GetListImages = async (req,res) => {
    try{
        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database)
        const images = database.collection(dbConfig.imgBucket + ".files");
        const cursor = images.find({}).sort({_id:-1})

        if((await cursor.count()) === 0){
            return res.status(500).send({
                messege: "no file found"
            })
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url : baseUrl + doc.filename
            })
        })
        console.log(fileInfos)
        // return res.status(200).send(fileInfos)
        return res.render('home',{data:fileInfos})

       

    }
    catch(error){
        return res.status(500).send({
            messege: error.messege
        });
    }
}


const download = async(req,res) => {
    try{
        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database)
        const bucket = new GridFSBucket(database,{
            bucketName: dbConfig.imgBucket
        })

        let downloadStream  = bucket.openDownloadStreamByName(req.params.name);
        
        downloadStream.on("data",function(data){
            return res.status(200).write(data);
        })

        downloadStream.on("error",function(err){
            return res.status(404).send({message: "connot donwload the image"});
        })
        downloadStream.on("end",() => {
            return res.end();
        })
    }
    catch(error){
        return res.status(500).send({
            message: error.message,
        })
    }

}

module.exports = {
    uploadFiles,
    GetListImages,
    download
}