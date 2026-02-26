const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async(req, res) => {

    try{
        const {username, email, password} = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
        username,
        email,
        password: hashedPassword,
    })

    res.status(201).json({ message: "User registered successfully" });

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Server Error"})
    }
})

router.post("/login", async(req, res) => {

try{

    const {email, password} = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if( !user ) {
        return res.status(400).json({message : "Invalid email"})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({message : "Invalid Password"})
    }

    const token = jwt.sign(
        {id : user._id, role : user.role, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )

    res.status(200).json({token, user : {username : user.username, role:user.role}, message: "Login Successful"})

    } catch(err) {
        res.status(500).json({message : "Server Error"})
    }   
})

module.exports = router;