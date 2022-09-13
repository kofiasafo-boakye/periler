import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
// const cors = require("cors")


//Routes
const app = express();

// Middleware
app.use(bodyParser.json({limit:'30mb', extended: true}));
app.use(bodyParser.urlencoded({limit:'30mb', extended: true}));
app.use(cors())


// to serve images for the public
app.use(express.static('public')); 
app.use('/images', express.static('images'));





dotenv.config()
const PORT = process.env.PORT;


mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(()=> {app.listen(PORT, ()=> {console.log( `Listening on port ${PORT}...`)})})
.catch((error) => {console.log(error)})



/*Usage of routes*/

//auth route
app.use('/auth', AuthRoute)

// user route
app.use('/user', UserRoute)

// posts route
app.use("/post", PostRoute)


//upload route
app.use("/upload", UploadRoute)
