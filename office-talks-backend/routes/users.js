const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// protect all user routes
router.use(auth);

// @route    POST api/users
// @desc     Create a new user (admin or authenticated use)
// @access   Private
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/profile
// @desc     Get current user profile
// @access   Private
router.get('/profile', async (req, res) => {
  try {
    // Get user ID from JWT token (decoded by auth middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - no user ID in token' });
    }

    // Fetch user from database without password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        date: user.date
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/profile
// @desc     Update current user profile (name, email)
// @access   Private
router.put('/profile', async (req, res) => {
  const { name, email } = req.body;
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - no user ID in token' });
    }

    // Validate input
    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide name or email to update' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        date: user.date
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/profile-image
// @desc     Upload/update user profile image (accepts base64 or file)
// @access   Private
router.put('/profile-image', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - no user ID in token' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle base64 image from request body
    const { profileImage } = req.body;
    
    if (!profileImage) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Store the image (base64 string or file buffer)
    user.profileImage = profileImage;
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        date: user.date
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users
// @desc     Get all users (no password)
// @access   Private
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/:id
// @desc     Get user by id
// @access   Private
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/:id
// @desc     Update user
// @access   Private
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE api/users/:id
// @desc     Delete user
// @access   Private
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
