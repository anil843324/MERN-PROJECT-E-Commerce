const ErrorHander = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');

const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto');
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

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        'Reset Password token is invalid or has been exprired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander('Password does not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get user Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander('Old password is incorrect', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander('password does not match', 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update User Profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (!(newUserData.name || newUserData.email)) {
    return next(new ErrorHander('Please add email or name', 404));
  }

 
  // we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  
  res.status(200).json({
    success: true,
    message: 'user Profile Updated',
  });
});


// Get all users (admin)

exports.getAllUsers=catchAsyncError(async (req, res, next) => {


   const users= await User.find();

     res.status(200).json({
        success:true,
        totalUsers:users.length,
        users
     })


})


// Get Single user(admin)

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);


   if(!user){
     return next( new ErrorHander(`User does not exist with Id: ${req.params.id}`))
   }

  res.status(200).json({
    success: true,
    user,
  });
});



// Update User Role By Admin

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  };

  if (!(newUserData.name || newUserData.email || newUserData.role)) {
    return next(new ErrorHander('Please add email or name or role', 404));
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  
  res.status(200).json({
    success: true,
    message: 'User Role Updated By Admin',
  });
});


// Delete User By Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user=await User.findById(req.params.id);
  // we will remove cloudinary later
  
    if(!user){
       return next( new ErrorHander(`User does not exist with Id:${req.params.id}`) )
    }
    
      await user.remove();


  res.status(200).json({
    success: true,
    message: 'User Deleted Successfully',
  });
});