// we will use bcrypt or bcrypt.js package both are almost similar( bcrypt helps you to hash your password).

// another package we will use the JWT(Json Web Token)

// to encrypt password we will use hooks of mongose like pre(which means just before storing the data we use this)

// jwt is a bearer token(meaning is that the one who bearers we consider it true(it is just like key))

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,        
        },
        avatar: {
            type: String, // cloudinary service will be used to store images and videos and its url will be here.
            required: true,
        },
        coverImage: {
            type: String, // cloudinary services
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refershToken: {
            type: String,

        }
    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
}) // we are using function keyword because we need to define the context in this thats why we canot use arrow function because it doesent have the concept of this.

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECREAT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// we keep less payload(data) in referesh token because it keeps on refreshing.
userSchema.method.generateRefreshToken = function(
    
){

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export  const User = mongoose.model("User",userSchema)