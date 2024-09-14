const userModel = require('../models/usersSchema')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//get user 
const getUser = async (req, res) => {
   try {
     const {id} = req.params;
     const fetchedUser = await userModel.findById(id).sort({createdAt: -1});

     if(!fetchedUser) {
       return res.status(404).json({error: "User not found"});
     } 
        res.status(200).json(fetchedUser)
   }
   catch (err) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
}

//const edit user 
// const editUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const modifiedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });

//         if (!modifiedUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         res.status(200).json(modifiedUser);
//     } catch (err) {
//          res.status(500).json({ error: "Failed to update user" });
//     }
// };
 
//delete user 
const deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        const removedUser = await userModel.findByIdAndDelete(id);
        
        if (!removedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};




//update user info
const updateUserInfo = async (req, res) => {
    const { ...updateFields } = req.body;
    const {id} = req.user;
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        id, 
        updateFields,
        {new: true}
    )
        res.status(200).json(updatedUser);
    }
    catch (err) {
      res.status(500).json({err: "Cannot update user info"})
    }
}
 

//update user password
const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const {id} = req.user;
    try {
        const getUser = await userModel.findById(id);
        if (!getUser) {
            return res.status(404).json({message: "User not found"});
        }

        // Compare the old password with the hashed password in the database
        const isMatch = bcrypt.compareSync(oldPassword, getUser.password);
        if (!isMatch) {
            return res.status(400).json({message: "Old password does not match"});
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({message: "New password cannot be the same as the old one"});
        }      

        // Hash the new password before saving it
        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        await userModel.findByIdAndUpdate(
            id,
            {password: hashedNewPassword},
            {new: true}
        );

        res.status(200).json({message: "Password successfully updated"});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Cannot update password"});
    }  
}


const updateRole = async (req, res) => {
    const {id} = req.body;
    const {role} = req.user;

    console.log("Role: ", role);  // Log the role to check its value

    if (role !== "SuperAdmin" && role !== "Admin") {
        return res.json({ message: "you don't have the permission" });
    }

    try {
        await userModel.findByIdAndUpdate(id, { role: "Admin" }, { new: true });
        res.json({ message: "user is now an admin" });
    } catch (error) {
        console.log(error);
    }
};


module.exports = { getUser, /*editUser,*/ deleteUser, updateUserInfo, updatePassword, updateRole };