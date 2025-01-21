import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"
//always start the IIFE(IMMEDIATELY INVOKED FUNCTION EXPRESSIONS) with a semicolon


dotenv.config({
  path:'./env'
})



connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
  })
})
.catch((err)=>{
  console.log("Mongo DB connection failed!!",err)
})

app.get('/', (req, res) => {
  res.send('Hello, world!');
});










/*import express from "express";
const app=express()

(async () => {
  try {
    //connecting database
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    //listeners
    app.on("error",(error)=>{
        console.log("ERROR",error)
        throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log("ERROR", error);
    throw error;
  }
})();*/
