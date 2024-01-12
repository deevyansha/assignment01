const express = require('express');
const userRouter = express.Router();
const userController = require('./userController');

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.put('/update/:id', userController.updateUserProfile);
userRouter.post('/forgot-password', userController.forgotPassword);
userRouter.put('/reset-password', userController.resetPassword);

module.exports = userRouter;
