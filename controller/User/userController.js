const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../model/userModel');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pandeydeevyansha@gmail.com',
      pass: 'gciy gjan zzgy tbqg',
    },
  });

module.exports = {

  //=============================================User APIs=========================================================================================
  
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, profileImage } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImage,
      });
      await newUser.save();
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await bcryptjs.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      var token = jwt.sign({ _id: user._id, email: user.email }, 'secretkey', { expiresIn: '24h' });
      var data = { token: token, _id: user._id, email: user.email };

      res.status(200).json({ message: 'Login successful', data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.header.id;
      const { name, email, password, profileImage } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        userId,
        { name, email,password, profileImage },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const resetToken = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: 'pandeydeevyansha@gmail.com',
        to: email,
        subject: 'Password Reset',
        html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error sending email' });
        }

        res.status(200).json({ message: 'Password reset email sent successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      jwt.verify(resetToken, 'secretkey', async (err, decoded) => {
        if (err) {
          return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const { email } = decoded;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
