// mongodb://127.0.0.1:27017/completeBackend

// require('dotenv').config({path: './env'}) // dot env uses the require syntax and not the moduler syntax.


import connectDB from "../src/db/index.js";
import dotenv from "dotenv"; // but if we want to use the moduler syntax we can use it like this and give the path afterwards.
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log('MONGO DB Connection failed !!!',err);
})











// 1st way to do it
// import express from "express";
// const app = express()
// // using iffs for the connection of database.
// ;(async () => {
//     try{

//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on('error',(error) => {
//             console.log("ERROR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listning on port ${process.env.PORT}`);
//         })


//     } catch(error) {
//         console.log("ERROR: ",error);
//         throw error
//     }
// })()