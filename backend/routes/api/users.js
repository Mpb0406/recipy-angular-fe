const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

//@route    POST api/users
//@desc     Register new user
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email reuqired").isEmail(),
    check("password", "Password must contain 6 characters").not().isEmpty(),
  ],
  async (req, res) => {
    //Validate data from req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    //Assign req data to variables
    const { name, email, password } = req.body;

    //Inside trycatch check for duplicate user info, assign req info to User model, hash password, return jwt
    try {
      // See if user exists
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already used" }] });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      //Assign req info to User Model
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Check if user was created
      if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ errors: [{ msg: "Invalid User Data" }] });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@route    DELETE api/users
//@desc     Delete user account
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.delete();
    res.send("Account deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = router;
