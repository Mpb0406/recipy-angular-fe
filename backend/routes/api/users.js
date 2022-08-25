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
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already used" }] });
      }

      //Assign req info to User Model
      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

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

module.exports = router;
