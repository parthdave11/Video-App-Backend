import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    
    // todos for registering user
    
    // get user details from frontend
    // validation{eg: if name is empty ,etc}
    // check if user already exists
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and referesh token field from response
    // check for user creation
    // return response

   const{fullName, email, username, password} = req.body
   

    // little advance syntax for if and some function in js
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")    
    }

    // db call
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("email: ",email);
    console.log("email: ",username);
    console.log("email: ",password);
    console.log("email: ",fullName);
    console.log("email: ",coverImageLocalPath);
    console.log("email: ",avatarLocalPath);
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const avatar = await avatarLocalPath
    // const coverImage = await coverImageLocalPath
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    
    // db call
    const user = await User.create({
        username,
        fullName,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refershToken"
        )

    if(!createdUser){
        throw new ApiError(500, 'Something went wrong while registering user')
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

} )

export {registerUser}