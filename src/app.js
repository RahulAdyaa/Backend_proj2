import express from "express"
import cors from "cors"
import cookiePareser from "cookie-parser"
const app = express()

//app.use tab use krte hain jab hame koi middlewares ya koi sonfig settings krni hain
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,


}))

app.use(express.json({limit:"16kb"})) // for accepeting json
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")) // to store public assets
export { app }