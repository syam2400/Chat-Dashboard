const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Check existing user
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				success: false,
				message: 'User already exists'
			});
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		user = await User.create({
			name,
			email,
			password: hashedPassword
		});

		// Create token payload
		const payload = {
			userId: user._id
		};

		// Generate token
		const token = jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		// Send response
		res.status(201).json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email
			}
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Server error'
		});
	}
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		const payload = {
			userId: user._id
		};

		const token = jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email
			}
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Server error'
		});
	}
});


module.exports = router;