const User = require('../model/User');
const { sendResetpasswordMail } = require('../services/mailService');
const { errorResponse, successResponse, createHashPassword, compareHashPassword, createToken, decodeToken } = require('../utils/utilities');
const { registerValidation, loginValidation } = require('../validator/userValidate');

// User Registration
const registerUser = async (req, res, next) => {
  try {
    // user validation
    const validateUser = await registerValidation(req.body);
    if (!validateUser) {
      return errorResponse(res, "Invalid email or password", 400, err.details[0].message);
    }

    // Check user email is already exist or not
    const existUser = await User.findOne({ email: validateUser.email });
    if (existUser) {
      return errorResponse(res, "User is already exist, Try to login", 400);
    }

    // Hash user password
    const hashPassword = await createHashPassword(validateUser.password, 10);

    // Create a user
    const newUser = await User.create({
      name: validateUser.name,
      email: validateUser.email,
      password: hashPassword
    });

    // save this user
    const saveUser = await newUser.save();
    const { _id, name, email, createdAt } = saveUser;

    // send a response back
    successResponse(res, "User created successfully.", 200, { _id, name, email, createdAt });

  } catch (err) {
    return errorResponse(res, "Something went wrong in registration", 400, err.message);
  }
};

// User Login
const loginUser = async (req, res, next) => {

  try {
    // user validation
    const validateUser = await loginValidation(req.body);
    if (!validateUser) {
      return errorResponse(res, "Invalid email or password", 400, err.details[0].message);
    }

    // check email is exist in db or not
    const existingUser = await User.findOne({ email: validateUser.email });
    if (!existingUser) {
      return errorResponse(res, 'Invalid email or password', 400);
    }

    // check password is valid or not
    const isValidPassword = await compareHashPassword(validateUser.password, existingUser.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password', 400);
    }

    existingUser.password = undefined;
    const { _id, name } = existingUser;

    // create a token 
    const token = createToken({ id: _id, name: name }, process.env.ACCESS_TOKEN, '180m');

    // send a response back to user with token
    successResponse(res, 'Login Successfully!', 200, existingUser, token);

  } catch (err) {
    return errorResponse(res, "Something went wrong in login", 400, err.message);
  }
};

// User Details
const getUser = async (req, res, next) => { };

// User Forgot Password
const forgotUserPassword = async (req, res, next) => {
  try {
    // 1. check user email is exist or not
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return errorResponse(res, 'User not found with this email id!.', 400);
    }

    const { _id, name, email } = existingUser;

    // 2. generate a temporary token for verification save it db
    const forgotToken = createToken({ id: _id, name: name }, process.env.ACCESS_TOKEN, '10m');

    // 3. this forgotToken update it to db temporary
    const data = await User.updateOne(
      { email: req.body.email },
      { $set: { forgotToken: forgotToken } },
    );

    // 4. send a email to user with forgot token
    sendResetpasswordMail(name, email, forgotToken);

    // res that will be delete when you delete it
    successResponse(res, 'Please check your email for the reset password link', 200, forgotToken);

    // 3. send a email using nodemailer with forgot token

    // 4. send back a response to user
  } catch (err) {
    return errorResponse(res, "Something went wrong in forgot password", 400, err.message);
  }
};

// User Reset Password
const resetUserPassword = async (req, res, next) => {
  try {
    // 1. Get the token from url params
    const resetToken = req.params.token;

    // 2. find the user who have this token
    const existUserWithToken = await User.findOne({ forgotToken: resetToken });
    if (!existUserWithToken) {
      return errorResponse(res, "fails", 400);
    }

    // 2. decode this token
    const decodedToken = decodeToken(existUserWithToken.forgotToken);

    // Get the current time in seconds
    let currentTime = Math.round(new Date() / 1000);

    // 3. check token is expired or not
    if (currentTime <= decodedToken.exp) {
      console.log("Not expired");
      successResponse(res, "Token Verified Successfully", 204);
    } else {
      console.log("expired");
      successResponse(res, "Link has been expired", 204);
    }

    // if expired then return an error response

    // 4. 
    // successResponse(res, "success", 200, decodedToken);
    // console.log(req.params.token);
  } catch (err) {
    return errorResponse(res, "Something went wrong in reset password", 400, err.message);
  }
};


// User New Password
const newUserPassword = async (req, res, next) => {
  try {
    console.log(req.params.token);
  } catch (err) {
    return errorResponse(res, "Something went wrong in new password", 400, err.message);
  }
};

module.exports = { registerUser, loginUser, getUser, forgotUserPassword, resetUserPassword, newUserPassword };