const User = require("../Models/Users");
const ErrorResponse = require("../utils/errorResponse");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide email and password", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("User not found or Incorrect Email", 404));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Incorrect Password", 404));
    }
    sendToken(user, 202, res);
  } catch (error) {
    next(error);
  }
};

exports.loggedin = async (req, res) => {
  try {
    if (req.cookies.xs) {
      const token = req.cookies.xs;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        res.status(200).json({
          loggedin: true,
        });
      }
    }else{
      res.json({
        loggedin:false
      })
    }
  } catch (error) {
    res.status(500).json({
      loggedin: false,
    });
  }
};
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("xs").end()
  } catch (error) {
    next(error);
  }
};

exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("User Not Found", 404));
    }
    const resetPasswordToken = user.getresetPasswordToken();

    await user.save();

    const resetPasswordUrl = `http://localhost:3001/auth/resetpass/${resetPasswordToken}`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset password</p>
        <a href="${resetPasswordUrl}" clicktracking="off">${resetPasswordUrl}</a>
        `;
    try {
      await sendMail({
        to: email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: { token: resetPasswordToken, message: "Email Sent" },
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordDate = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordDate: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordDate = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Done",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res
    .status(statusCode)
    .cookie("xs", token, {
      sameSite: "strict",
      path: "/",
      //   maxAge: ,
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      token,
    });
  // res.status(statusCode).json({
  //     success:true,
  //     token
  // })
};
