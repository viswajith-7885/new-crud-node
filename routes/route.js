const express= require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index',{title:'home page'})
})

router.get('/adduser',(req,res)=>{
    res.render('add_users',{title:'add user'})
})

module.exports =router;