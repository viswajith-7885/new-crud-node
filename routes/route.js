const express= require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require("multer")

// image upload
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
        
    }
})

//middleware
var upload = multer({
    storage: storage,
}).single("fileInput");

//insert a user into database

router.post('/add',upload,(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,
    })
    user.save()
    req.session.message={
        type:'success',
        message:'user added succesfully'
    }
    res.redirect('/')
})

//get all users route
router.get('/',(req,res)=>{
    User.find().exec()
    .then(result => {
        res.render('index',{
                         title:'Home page',
                         users:result,
                    })
      })
      .catch(err => {
        res.json({message:err.message})
      });
})

router.get('/add',(req,res)=>{
    res.render('add_users',{title:'add user'})
})

module.exports =router;