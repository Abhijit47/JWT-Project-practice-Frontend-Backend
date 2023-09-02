const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// define a function to send success response
exports.successResponse = (res, message, statusCode, data, token) => {
  return res.status(statusCode).json({ message: message, data: data, token: token });
};

// define a function to send error response
exports.errorResponse = (res, message, statusCode, err) => {
  return res.status(statusCode).json({ message: message, err: err });
};

// define a function to create jwt token
exports.createToken = (payload, secretToken, expiresIn) => {
  return jwt.sign(payload, secretToken, { expiresIn: expiresIn });
};

// define a function to decode jwt token
exports.decodeToken = (token) => {
  return jwt.decode(token);
};

// define a function to create hash of current password
exports.createHashPassword = async (data, saltOrRounds) => {
  return await bcrypt.hash(data, saltOrRounds);
};

// define a function to compare current password with existing password
exports.compareHashPassword = async (currentPassword, encryptedPassword) => {
  return await bcrypt.compare(currentPassword, encryptedPassword);
};

// console.log("env", process.env.email);