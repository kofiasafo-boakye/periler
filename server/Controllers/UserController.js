import UserModel from "../Models/userModel.js";
import bcrypt, { genSalt } from "bcrypt";



// function to get one user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id)

        if(user){

            const {password, ...otherDetails} = user._doc;

            res.status(200).json(otherDetails)
        }
        else{
            res.status(400).json("User does not exist")
        }

        
    } catch (error) {
        res.status(500).json( error)
    }
}



// function to update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const {currentId, currentUserAdminStatus, password} = req.body;

    if(id === currentId || currentUserAdminStatus ){

        if(password){
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(password, salt)
        }


        try {
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json( error)

        }
    }
    else{
        res.status(403).json("Access denied!!! You can only update your profile")
    }
}


// function to delete a user

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const {currentId, currentUserAdminStatus} = req.body;

    if(id === currentId || currentUserAdminStatus){

        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json( error)

        }
    }

} 

// function to follow a user
export const followUser = async (req, res) => {
    // id of user to be followed
    const id = req.params.id;

    // id of user who wants to follow another user
    const {currentUserId} = req.body;

    if(currentUserId === id) {
        res.status(403).json("Dont do that! You cannot follow yourself");
    }
    else{
        /*its good to do try and catch when going into a database*/ 
        try {
            // user to be followed
            const followUser = await UserModel.findById(id)

            // user who wants to follow
            const followingUser = await UserModel.findById(currentUserId)


            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push: {followers : currentUserId}})
                await followingUser.updateOne({$push: {following : id}})

                res.status(200).json("User Followed")
            }
            else{
                res.status(403).json("You are already following this user")
            }


        } catch (error) {
            res.status(400).json(error)
        }
    }

}



// function to unfollow a user
export const unfollowUser = async (req, res) => {
    // id of user to be followed
    const id = req.params.id;

    // id of user who wants to follow another user
    const {currentUserId} = req.body;

    if(currentUserId === id) {
        res.status(403).json("Dont do that! You cannot follow yourself");
    }
    else{
        /*its good to do try and catch when going into a database*/ 
        try {
            // user to be followed
            const followUser = await UserModel.findById(id)

            // user who wants to follow
            const followingUser = await UserModel.findById(currentUserId)


            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull: {followers : currentUserId}})
                await followingUser.updateOne({$pull: {following : id}})

                res.status(200).json("User unFollowed")
            }
            else{
                res.status(403).json("User is not followed by you")
            }


        } catch (error) {
            res.status(400).json(error)
        }
    }

}

