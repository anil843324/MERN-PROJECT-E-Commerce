const ErrorHander = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');

const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const crypto=require('crypto')
const sendEmail = require('../utils/sendEmail');

// Registe a User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is a sample id',
      url: 'profilePic',
    },
  });

  sendToken(user, 201, res);
});

// Login User

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHander('Please Enter Email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

   

  if (!user) {
    return next(new ErrorHander('Invalid email or password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  
 
  if (!isPasswordMatched) {
    return next(new ErrorHander('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

//logout User

exports.logOUtUser = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// Forget Password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

   

  if (!user) {
    return next(new ErrorHander('User not found', 404));
  }

  // Get ResetPassword Token

  const resetToken = user.getResetPasswordToken();

  

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested this email then, please ignore it`;

  
  try {
   
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email set to ${user.email} successfully`,
    });
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
   
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }

});

// Reset Password

exports.resetPassword=catchAsyncError( async(req,res,next)=>{


// Creating token hash
  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');


   const user=await User.findOne({

    resetPasswordToken,
    resetPasswordExpire:{ $gt:Date.now()},
   })


    if(!user){
       return next( new ErrorHander('Reset Password token is invalid or has been exprired',400))
    }

   if(req.body.password !== req.body.confirmPassword){

    return next( new ErrorHander('Password does not match',400))
   }

    user.password=req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

     await user.save();
  
      sendToken(user,200,res)
})