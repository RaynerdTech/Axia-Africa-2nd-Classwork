const bcrypt = require('bcryptjs');
const userModel = require('../models/usersSchema')
const jwt = require('jsonwebtoken')

//create user
const register = async (req, res) => {
    try {
        const { userName, password, email, gender, age, role } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Create a new user
        const newUser = new userModel({
            userName,
            password: hashPassword,
            email,
            gender,
            age,
            role: role || "User" // Use provided role or default to "User"
        });

        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
        console.log(saveUser);

    } catch (err) {
        res.status(500).json({ error: "Unable to create user" });
        console.log(err);
    }
};


//login 
const loginUser = async (req, res) => {
    //checking if email matches
    const {email, password} = req.body 
    try {
      const userInfo = await userModel.findOne({email});
      if(!userInfo) {
        return res.status(500).json({message: "unable to find user"})
      };
    //checking if password matches
    const verify = bcrypt.compareSync(password, userInfo.password);
    console.log(verify);
    if(!verify) {
        return res.status(401).json({ message: "Password does not match" });
    }
    const aboutUser = {id:userInfo.id, role: userInfo.role};
    const token = jwt.sign(aboutUser, process.env.JWT_SECRET);
    console.log(token)
    res.cookie('user_token', token)
    res.status(200).json({message: "successfully logged in"});
    // res.status(200).json(userInfo);
    }
    catch (err) {
       res.status(500).json({ error: "Failed to login" });
        console.log(err);
    }
}


module.exports = {register, loginUser};