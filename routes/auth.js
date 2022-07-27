const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");


router.post("/signup",(req,res)=>{
  const {name,email,password,pic} = req.body
  if(!email || !password || !name){
    return res.status(422).json({error:"please fill all the fields"})
  }
  User.findOne({email:email})
    .then((findUser)=>{
    if(findUser){
      return res.status(422).json({error:"Email already exists"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const newUser = new User({
          email,
          password:hashedpassword,
          name,
          pic
        })
        newUser.save()
        .then(newUser=>{
          res.json({message:"Successfully registered"})
        })
        .catch(err=>{
          console.log(err);
        })
      })
      .catch(err=>{
        console.log(err);
      })
    })
})

router.post("/signin",(req,res)=>{
  const {email,password} = req.body
  if(!email || !password){
    return res.status(422).json({error:"please fill all the fields"})
  }
  User.findOne({email:email})
  .then(findUser=>{
    if(!findUser){
      return res.status(422).json({error:"Invalid Email or password"})
    }
    bcrypt.compare(password,findUser.password)
    .then(doMatch=>{
      if(doMatch){
        //res.json({message:"successfully signed in"})
        const token = jwt.sign({_id:findUser._id},JWT_SECRET)
        const {name,email,_id,followers,following,pic} = findUser
        res.json({token,user:{_id,name,email,followers,following,pic}})
      }
      else{
        return res.status(422).json({error:"Invalid Email or password"})
      }
    })
    .catch(err=>{
      console.log(err);
    })
  })
})

module.exports = router
