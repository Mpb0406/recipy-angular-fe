const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

//@route    POST api/auth
//@desc     Login User
//@access   Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Password required").not().isEmpty(),
  ],
  async (req, res) => {
    // Validate Request Data
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    let user = await User.findOne({ email });

    try {
      // Check if user exists throw error if not
      if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/auth
//@desc     Get User Info
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
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
