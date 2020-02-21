const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const sendEmail = require('../../utils/email/sendEmail');
const emailTemplates = require('../../utils/email/emailTemplates');

// Models
const User = require('../../models/User');

// utils
const {
	getBeginningOfWeekDate,
	getBeginningOfMonthDate
} = require('../../utils/dateFunctions');

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
				if (!user.isConfirmed) {
					user.tempData.confirmId = uuid.v4();

					await user.save();

					const payload = {
						confirmation: {
							id: user.tempData.confirmId
						}
					};

					jwt.sign(
						payload,
						config.get('jwtSecret'),
						{ expiresIn: 3600 },
						async (err, token) => {
							if (err) throw err;
							await sendEmail(email, emailTemplates.confirmationEmail(token));
							res.status(200).json('Reconfirmation email sent');
						}
					);
				} else {
					return res
						.status(400)
						.json({ errors: [{ msg: 'User already exists' }] });
				}
			}

			user = new User({
				firstName,
				lastName,
				email,
				password
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			user.tempData.confirmId = uuid.v4();

			await user.save();

			const payload = {
				confirmation: {
					id: user.tempData.confirmId
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 3600 },
				async (err, token) => {
					if (err) throw err;
					await sendEmail(email, emailTemplates.confirmationEmail(token));
					res.status(200).json('Confirmation email sent');
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

			if (user.isConfirmed === false) {
				return res.status(400).json({
					errors: [{ msg: 'Must confirm your email before logging in' }]
				});
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

// @route    PUT users/user
// @desc     Update auth user
// @access   Private
router.put(
	'/user',
	[
		auth,
		[
			check('firstName', 'Name is required')
				.not()
				.isEmpty(),
			check('lastName', 'Name is required')
				.not()
				.isEmpty(),
			check('email', 'Please include a valid email').isEmail()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { firstName, lastName, email } = req.body;

		try {
			const user = await User.findById(req.user.id).select('-password');

			if (user.email !== email) {
				const existingEmail = await User.findOne({ email });

				if (existingEmail) {
					return res
						.status(400)
						.json({ errors: [{ msg: 'Email already exists' }] });
				}
			}

			user.firstName = firstName;
			user.lastName = lastName;
			user.email = email;
			await user.save();

			res.json(user);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

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

// @route    POST users/user/confirmAccount/:confirm_token
// @desc     Post token after user has confirmed their email
// @access   Public
router.post('/user/confirmAccount/:confirm_token', async (req, res) => {
	let confirmation;
	try {
		await jwt.verify(
			req.params.confirm_token,
			config.get('jwtSecret'),
			(error, decoded) => {
				if (error) {
					res.status(401).json({ msg: 'Token is not valid' });
				} else {
					confirmation = decoded.confirmation;
				}
			}
		);

		const user = await User.findOne({
			'tempData.confirmId': confirmation.id
		});

		if (!user) {
			return res
				.status(400)
				.json({ msg: 'User does not exist or link has expired' });
		}

		user.isConfirmed = true;
		user.tempData.confirmId = null;
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
		res.status(500).send('Server Error');
	}
});

// @route    POST users/user/changePassword
// @desc     Post change password link to email
// @access   Public
router.post(
	'/user/changePassword',
	[check('email', 'Please include a valid email').isEmail()],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ msg: 'Not a valid email address' });
			}

			const payload = {
				user: {
					password: user.password
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 3600 },
				async (err, token) => {
					if (err) throw err;
					await sendEmail(email, emailTemplates.createNewPassword(token));
					res.json('Change password email has been sent');
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    POST users/user/newPassword/:password_token
// @desc     Post change password link to email
// @access   Public
router.post(
	'/user/newPassword/:password_token',
	[
		check('password', 'Must provide password')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { password } = req.body;

		let decodedUser;
		try {
			await jwt.verify(
				req.params.password_token,
				config.get('jwtSecret'),
				(error, decoded) => {
					if (error) {
						res.status(401).json({ msg: 'Token is not valid' });
					} else {
						decodedUser = decoded.user;
					}
				}
			);

			const user = await User.findOne({ password: decodedUser.password });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials or link expired' }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Cannot use same password' }] });
			}

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			await user.save();

			res.json('password updated');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    POST users/user/spendingLimit
// @desc     Set user's spending limit
// @access   Private
router.post(
	'/user/spendingLimit',
	[
		auth,
		[
			check('amountLimit', 'Must provide amountLimit')
				.not()
				.isEmpty(),
			check('timePeriodLimit', 'Must provide timePeriodLimit')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { amountLimit, timePeriodLimit } = req.body;
		try {
			const user = await User.findById(req.user.id);

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User does not exist' }] });
			}

			user.spendingLimit.currentLimit.currentAmountLimit = amountLimit;
			user.spendingLimit.currentLimit.currentTimePeriodLimit = timePeriodLimit;

			if (
				user.spendingLimit.currentLimit.currentTimePeriodLimit === 'Per Week'
			) {
				user.spendingLimit.currentLimit.currentTimePeriod = getBeginningOfWeekDate();
			} else if (
				user.spendingLimit.currentLimit.currentTimePeriodLimit === 'Per Month'
			) {
				user.spendingLimit.currentLimit.currentTimePeriod = getBeginningOfMonthDate();
			}

			await user.save();

			res.json(user.spendingLimit.currentLimit);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    DELETE users/user/spendingLimit
// @desc     Delete user's spending limit
// @access   Private
router.delete('/user/spendingLimit', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
		}

		user.spendingLimit.perviousLimit.perviousAmountLimit =
			user.spendingLimit.currentLimit.currentAmountLimit;
		user.spendingLimit.perviousLimit.perviousTimePeriodLimit =
			user.spendingLimit.currentLimit.currentTimePeriodLimit;
		user.spendingLimit.perviousLimit.perviousTimePeriod =
			user.spendingLimit.currentLimit.currentTimePeriod;

		user.spendingLimit.currentLimit.currentAmountLimit = null;
		user.spendingLimit.currentLimit.currentTimePeriodLimit = null;
		user.spendingLimit.currentLimit.currentTimePeriod = null;
		await user.save();

		res.json('Removed user spending limit');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
