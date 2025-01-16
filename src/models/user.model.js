import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new Schema(
    {
        
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,            
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url
            required:true,
        },
        coverImage:{
            type:String
        },
        //watch history will be a array , kyuki multiple values daalenge 
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            reuired:[true,'Password is required']
        },
        refreshToken:{
            type:String
        }

    },{timestamps:true}
)

userSchema.pre("save " , async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password , 12) // 12 are basically the salt rounds
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(//payload,accessToken
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//here , code for refresh token and access token is almost same , but in refresh token , we take only id , but in access token , we take a large amount of payload data

export const User = mongoose.model("User",userSchema)