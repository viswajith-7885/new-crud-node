//import modules
const env=require('dotenv')
const express=require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app =express()

env.config();
const PORT=process.env.PORT;

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.message =req.session.message;
    delete req.session.message;
    next();
})

//set template engine

app.set('view engine','ejs');

app.use(express.static("uploads"));

//database connetion

main().catch((err) => console.log("mondo error ",err));
async function main() {
  await mongoose.connect(process.env.DB_URI);
  console.log("db connected")
}

app.use("",require("./routes/route"))


app.listen(PORT,()=>{
    console.log(`server running port:${PORT}`)
})