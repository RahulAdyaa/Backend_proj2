import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {validateEmail} from "../validations.js"
// to check if user already exist or not
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists : username,email
  // check for images , check for avatar
  // upload them to cludinary ,  mainly check for avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response


  // to get data from frontend
  const {fullName , email , username , password} = req.body
  console.log("email:",email);
  console.log("password:",password);
  console.log("username:",username);
  console.log("fullName:",fullName);
  
  // validation

  // if(fullName===""){
  //   throw new ApiError(400 , "full Name is required")
  // }
  // we can check foe each using above syntax but if we want to do it in a group , then we use following code
  
  //validation using array
  if(
    [fullName,email,username,password].some((field)=>
      field?.trim() === "")
  ){
    throw new ApiError(400 , "all fields are required")
  }
  
  validateEmail(email)

  const existedUser=User.findOne({
    $or:[{ username },{ email }]
  })
  if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
  }
  //req.body given by default by express
  // req.files given by multer
  // ? means optional
  /*
  It’s like asking:

  "Hey, does the request have any files?"
  If yes, "Is there a file named 'avatar'?"
  If no, "Okay, just return nothing and move on without breaking."
  */
 
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log("avatarLocalPath:",avatarLocalPath);
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }

  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage= uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"avatar file is required")

  }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "", // hai ya nai
    email,
    password,
    username:username.toLowerCase()
  })

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken" // we write here , jo ke nahi chahiye 
  )
  if(!createduser){
    throw new ApiError(500,"something went wrong while registrting the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createduser , "user registered successfully")
  )
});


export { registerUser, };
