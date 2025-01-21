import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {validateEmail} from "../validations.js"
// to check if user already exist or not
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessAndRefreshTokens = async (userId) => {
  try {
      const user = await User.findById(userId);
      if (!user) {
          throw new ApiError(404, "User not found for token generation");
      }
      if (!user.generateAccessToken || !user.generateRefreshToken) {
          throw new ApiError(500, "Token generation methods are missing");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
  } catch (error) {
      console.error("Token generation error:", error);
      throw new ApiError(500, "Something went wrong while generating tokens");
  }
};


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
  
  // validation

  // if(fullName===""){
  //   throw new ApiError(400 , "full Name is required")
  // }
  // we can check foe each using above syntax but if we want to do it in a group , then we use following code
  
  //validation using array
  if ([username, fullName, email, password].some(field =>field ===undefined ||  field?.trim() === "")) { 
    throw new ApiError(400, "All field are required !!"); 
    }
  
  
  validateEmail(email)

  const existedUser= await User.findOne({
    $or:[{ username },{ email }]
  })
  if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
  }

  // console.log("req files",req.files)
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
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;



  console.log("avatarLocalPath:",avatarLocalPath);



  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files.coverImage[0].path
  }
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

const loginUser = asyncHandler(async(req,res)=>{
    // req body -> data
    //username or email
    //find the user
    //password check
    // access and refresh token generate
    // send cookies (secure)

    const{email,username,password} = req.body
    console.log(email)

    if (!(username || email)) {
      throw new ApiError(400,"username or email is required")
    } 
    const user = await User.findOne({
      $or:[{username},{email}]
    })

    if (!user) {
      throw new ApiError(404, "User not found for token generation");
    }
    
    // abhi username and password to check krlia , abb kya?

    //password check krenge ab
    const isPasswordValid = await user.password
    if (!isPasswordValid) {
      throw new ApiError(401,"Invalid user credentials")
      
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser =  await User.findById(user._id).select("-password -refreshToken") // hame ye 2 chizein nahi bhejni
    
    const options ={
      httpOnly:true,
      secure:true // these cookies are now modifiable only by server and not by frontend
      
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse( // this is done when user is trying to save the access token and refreh token by itself , not a good practice but is done
        200,
        {
          user:loggedInUser,accessToken,refreshToken
        },
        "User logged in successfully"
      )
    )


})

const logoutUser = asyncHandler(async(req,res)=>{
  // refresh token and access token ko sambhalo

  // now during login in , hamne email , username and password , user se le liye the and then we got hands on to our user , but logout ke time pe ham username , email , vagera thodi na mangege

  // New concept :  " MIDDLEWARE "

  await User.findByIdAndUpdate(
    req.user._id,
    {
      //abb ntana padega , what to update
      $set:{
        refreshToken:undefined
      },
      new:true // return mein jo response milega , usmein new updated value milegi , kyuki agar old milegi to old refresh token bhi miljayega
    }
  )

  const options = {
    httpOnly:true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200 , {} , "User logged Out"))
})

export { registerUser, loginUser , logoutUser};

// if we are using req , and next but not res , then we can write like

/*asyncHandler(async(req, _ , next)=>{
  // code
})*/
