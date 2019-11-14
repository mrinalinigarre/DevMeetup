const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //get token from the header
  const token = req.header('x-auth-token');

  //check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //verify the token
  try {
    const decodeduser = jwt.verify(token, config.get('jwtSecret'));

    req.user = decodeduser.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
