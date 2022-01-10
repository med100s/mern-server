const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Get token from header
  try{
    const token = req.header("authorization").split(' ')[1];
    console.log(token, req.method, req.headers, req.header);

    // Check if no token
  }catch{
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  
  try {
    const token = req.header("authorization").split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid"});
  }
};
