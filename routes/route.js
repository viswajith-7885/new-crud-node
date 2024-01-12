const express= require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require("multer")
const fs =require('node:fs')

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

//Edit an user route

router.get('/edit/:id',(req,res)=>{
    const id = req.params.id
      User.findById(id)
  .then(user => {
    res.render('edit_users',{
                    title:" edit user",
                    user:user
  })
})
  .catch(err => {
         if(err){
           
             res.redirect('/')
        }
  });
   
})

// update user route
router.post('/update/:id',upload,(req,res)=>{
    const id = req.params.id
    let new_image ="";

    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image)
        }catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image
    }

    User.findByIdAndUpdate(id, {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:new_image
    })
  .then(result => {
    req.session.message = {
        type:"success",
        message: 'User updated successfully'
    }
    res.redirect('/')
  })
  .catch(err => {
    res.json({message:err.message,type:'danger'})
  });
})

//delete user route
router.get('/delete/:id',(req,res)=>{
    const id= req.params.id
    User.findByIdAndDelete(id)
    .then(result=>{
        if(result.image != " "){
            try{
                fs.unlinkSync('./uploads/'+result.image)
                req.session.message = {
                    type: 'success',
                    message: " user deleted succesfully"
                }
                res.redirect('/')
            }catch(err){
                console.log(err);
            }
        }
    })
    .catch(err=>{
        res.json({message:err.message})
    })
})

module.exports =router;