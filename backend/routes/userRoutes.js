
const express=require('express');
const { registerUser, loginUser, logOUtUser, forgotPassword, resetPassword} = require('../controllers/userController');


const router=express.Router();





router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get( logOUtUser);


module.exports=router;