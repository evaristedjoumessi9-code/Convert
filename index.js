require("dotenv").config()
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path")
const app = express();
const port = process.env.PORT || 3000

    const storage = multer.diskStorage({
        destination: `./uploads`,
        filename: (req,file,cb)=>{
            cb(null,file.fieldname+"_"+Date.now())
        }
    })
const upload = multer({storage: storage})  
app.use(cors())
app.post("/",upload.single("file"),(req,res)=>{
    var mod = req.file.path+req.body.newExt
    exec(`ffmpeg -i ${req.file.path} ${mod}`,(err,stdout)=>{
        if(err) res.send({err: true});
        res.send(fs.readFileSync(mod))
        fs.unlinkSync(mod)
        fs.unlinkSync(req.file.path)
    })
})
app.listen(port);