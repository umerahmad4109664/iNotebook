const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const router = express.Router();
const { body, validationResult } = require("express-validator"); // Import 'body' from express-validator
var jwt = require('jsonwebtoken');
var fetchuser = require('../middlewere/Fetchuser');

const JWT_SECRET = 'qwerty123'
// ROUTE :1 create a user using: POST'/api/auth/createuser'. No login required
router.post(
  "/createuser",
  [
    body("name", "enter vaild name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      // password hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // jwt authentication
      const data ={
        user:{
          id: user.id
        }
      }
     const authtoken = jwt.sign(data,JWT_SECRET)
    

      // res.json(user);
      res.json({authtoken})

      // catch error
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE:2 Authenticate a user using: POST '/api/auth/login'. No login required

router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If thre are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"please try to login with correct credentials"})
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if(!passwordcompare){
        return res.status(400).json({error:"please try to login with correct credentials"})
      }
    // authtoken data
      const data ={
        user:{
          id: user.id
        }
      }
    // authtoken
     const authtoken = jwt.sign(data,JWT_SECRET)
     res.send({authtoken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Interval Server Error");
    }

  })

  // ROUTE:3 Get loggedin user details using: POST '/api/auth/getuser'. Login required
  router.post(
    "/getuser", fetchuser ,async (req, res) => {
  try{
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)

  }catch (error) {
      console.error(error.message);
      res.status(500).send("Interval Server Error");
    }
    })
module.exports = router;
