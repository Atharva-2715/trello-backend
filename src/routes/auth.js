const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup',async(req,res)=>{
    try{
        const {username, email, password} = req.body;
        
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        await newUser.save();

        res.status(201).json({message:"User created successfully."})
    }catch (err) {
        console.error("❌ Signup error:", err);   // <-- log the actual error
        res.status(500).json({ message: "Error registering user", error: err.message });
      }
})

router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;

        const existingUser = await User.findOne({email});
        
        if(!existingUser){
            res.status(400).json({message:"Invalid Username."})
        }

        const passwordValidation = bcrypt.compare(password.existingUser, password);
        if(!passwordValidation){
            res.status(400).json({message:"Invalid password."});
        }


        //token generation
        const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            user: { id: existingUser._id, username: existingUser.username, email: existingUser.email },
            token
        });

    }
    catch(err){
        console.error("Login error:", err);   // <-- log the actual error
        res.status(500).json({ message: "Error registering user", error: err.message });
    }   
})

module.exports = router;