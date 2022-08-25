const express = require("express");
const router = express.Router();
const User = require('../../Models/User');
const {
  check,
  validationRequest,
  validationResult,
} = require("express-validator");
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

    try {
      // Check if user exists throw error if not
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Compare plain-text password in req with hashed password associated w/ email in req
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: "Invalid password" }] });
      }

      // Create payload for JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign token with user id payload
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);


//@route    GET api/auth
//@desc     Get User Info
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

module.exports = router;
