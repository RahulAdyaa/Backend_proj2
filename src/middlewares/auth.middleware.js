import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    console.log("Extracted Token:", token); // Debug log

    if (!token) {
        throw new ApiError(401, "Unauthorized request: Token missing or incorrect format");
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken); // Debug log

        // Find the user associated with the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log the error

        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
