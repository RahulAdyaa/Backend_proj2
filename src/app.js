import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

//app.use tab use krte hain jab hame koi middlewares ya koi sonfig settings krni hain
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,


}))

app.use(express.json({limit:"16kb"})) // for accepeting json
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")) // to store public assets , we have already made public folder
app.use(cookieParser())
export { app }


//routes import

import userRouter from "./routes/user.routes.js"

//routes declaration

app.use("/api/v1/users",userRouter)

