import { Router } from "express";
import { 
      changeCurrentUserPassword,
      getCurrentUser,
      loginUser,
      updateUserAvatar, 
      logoutUser,
      refreshAccessToken,
      registerUser, 
      updateAccountDetails, 
      updateUserCoverImage, 
      getUserChannelProfile, 
      getWatchHistory } from "../controllers/user.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/register").post(
    //injecting middleware just before posting 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)


router.route("/login").post(loginUser) 


// sbb kuch ese routes hain jo mujhe user ko dene hain , jab user login ho

//SECURED  ROUTES
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentUserPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router