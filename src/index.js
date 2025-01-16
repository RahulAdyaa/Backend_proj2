import dotenv from "dotenv"
import connectDB from "./db/index.js";
//always start the IIFE(IMMEDIATELY INVOKED FUNCTION EXPRESSIONS) with a semicolon


dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
  app.listen(ProcessingInstruction.env.PORT || 8000,()=>{
    console.log(`server is running at port ${ProcessingInstruction.env.PORT}`)
  })
})
.catch((err)=>{
  console.log("Mongo DB connection failed!!",err)
})












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
