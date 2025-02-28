const jwt = require("jsonwebtoken");

const requiredSignIn = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECURE
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json("Unauthorized: " + err.message);
  }
};
module.exports = { requiredSignIn };
