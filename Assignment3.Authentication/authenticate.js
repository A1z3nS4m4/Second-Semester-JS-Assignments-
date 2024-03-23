function authenticate(req, res, next) {
  const { username, password } = req.body;
  console.log("authenticate", req.body);
  const user = findUser(username);
  if (!user) {
    res.statusCode = 401;
    res.end();
    return;
  }
  if (user.username !== username || user.password !== password) {
    res.statusCode = 401;
    res.end();
    return;
  }
  next(req, res);
} 

module.exports = { authenticate }