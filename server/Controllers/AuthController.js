import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// function to register a new user
export const registerUser = async(req, res) => {
    const {name, email, password} = req.body;

    const salt = await bcrypt.genSalt(10)
    
    const hashedPassword = await bcrypt.hash(password, salt)


    const newUser = new UserModel({name, email, password: hashedPassword})


    try{
        const alreadyExists = await UserModel.findOne({email})

        if(alreadyExists) {
            return res.status(400).json({message: "Email already taken"})
        }
        const user = await newUser.save()

        const token = jwt.sign({
            email: user.email,
            id: user._id 
        }, process.env.JWT_KEY, {expiresIn: "1h"})

        res.status(200).json({user, token})
        
    }catch (error){
        res.status(500).json({message: error.message})

    }


}

// function to login a user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email: email})

        if(user){
            const validation = await bcrypt.compare(password, user.password)

            // validation? res.status(200).json(user) : res.status(400).json("Wrong user details")

            if(!validation){
                res.status(400).json("Wrong password")
            }
            else{
                const token = jwt.sign({
                    email: user.email,
                    id: user._id 
                }, process.env.JWT_KEY, {expiresIn: "1h"})
                res.status(200).json({user, token})
            }
        }
        else{
            res.status(400).json("user not found")
        }
    } catch (error) {
        res.status(500).json({message: error.message})

    }

    
}