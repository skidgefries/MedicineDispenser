const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
