const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../../models/User');

// @route GET api/users/user/register
// @desc Register user & get token
// @access Public
router.post(
	'/user/register',
	[
		check('firstName', 'Name is required')
			.not()
			.isEmpty(),
		check('lastName', 'Name is required')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { firstName, lastName, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			const donationPie = {
				availablePercentage: 100,
				slices: []
			};

			user = new User({
				firstName,
				lastName,
				email,
				password,
				donationPie
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id
				}
			};

			// TODO: Change expiresIn to 3600 for production
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route    POST api/users/user/login
// @desc     Login user & get token
// @access   Public
router.post(
	'/user/login',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			// TODO: Change expiresIn to 3600 for production
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route    GET users/user
// @desc     Get auth user
// @access   Public
router.get('/user', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    GET users/user/selectedReceiver
// @desc     Get auth user's selected receiver
// @access   Private
router.get('/user/selectedReceiver', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const selectedReceiver = await Receiver.findById(user.selectedReceiverId);
		res.json(selectedReceiver);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    POST users/user/selectedReceiver
// @desc     Post auth user's selected receiver
// @access   Private
router.post(
	'/user/selectedReceiver',
	[
		auth,
		[
			check('receiverId', 'Must provide receiverId')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const { receiverId } = req.body;
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const user = await User.findById(req.user.id);

			if (user.selectedReceiverId) {
				return res
					.status(400)
					.json({ msg: 'A receiver has already been selected' });
			}

			user.selectedReceiverId = receiverId;

			await user.save();

			res.json(user.selectedReceiverId);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    GET users/user/selectedReceiver/:receiver_id
// @desc     Get auth user's selected receiver
// @access   Private
router.delete('/user/selectedReceiver/:receiver_id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user.selectedReceiverId) {
			return res
				.status(400)
				.json({ msg: 'No receiver has been selected by user' });
		}

		const receiver = await Receiver.findById(req.params.receiver_id);
		if (!receiver) {
			return res.status(400).json({ msg: 'Receiver provided does not exist' });
		}

		if (user.selectedReceiverId != receiver._id) {
			return res.status(400).json({
				msg: 'User selected receiver does not match receiver provided'
			});
		}

		user.selectedReceiverId = undefined;
		await user.save();

		res.json('Receiver unselected from user');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
