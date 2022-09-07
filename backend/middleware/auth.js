const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split 'Bearer' and the token and get just the token
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Find user by token payload and assign to req.user
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
};
