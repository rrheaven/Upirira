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

// @route    Post api/users/user/bank
// @desc     Add bank to user profile
// @access   Private
router.post(
	'/user/bank',
	[
		auth,
		[
			check('bankId', 'Must provide Bank')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { bankId } = req.body;
		const newBank = { bankId };

		try {
			const user = await User.findById(req.user.id);
			user.banks.unshift(newBank);

			await user.save();

			res.json(user);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    Post api/users/user/pie
// @desc     Add/Update pie slice to user profile
// @access   Private
router.post(
	'/user/pie',
	[
		auth,
		[
			check('percentage', 'Must provide Bank')
				.not()
				.isEmpty(),
			check('receiverId', 'Must provide Bank')
				.not()
				.isEmpty(),
			check('receiverName', 'Must provide Bank')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { percentage, receiverId, receiverName } = req.body;
		const newSlice = { percentage, receiverId, receiverName };

		try {
			if (newSlice.percentage < 10) {
				return res.status(400).json({
					errors: [{ msg: 'Percentage has to be greater than 10' }]
				});
			}

			let userDefault = await User.findById(req.user.id);

			if (userDefault.donationPie.slices.length >= 5) {
				return res.status(400).json({
					errors: [{ msg: 'Cannot add more recipients' }]
				});
			}

			// Find if user already has same slice
			user = await User.findOne({
				_id: req.user.id,
				'donationPie.slices.receiverId': newSlice.receiverId
			});

			if (user) {
				// If so update

				const initialSum = user.donationPie.slices
					.map(slice => slice.percentage)
					.reduce((a, b) => a + b, 0);

				const initialSlice = user.donationPie.slices.find(function(slice) {
					return slice.receiverId == newSlice.receiverId;
				});

				const newSum =
					initialSum - initialSlice.percentage + newSlice.percentage;

				if (newSum > 100) {
					return res.status(400).json({
						errors: [{ msg: 'Overall percentage cannot be over 100' }]
					});
				} else {
					let user = await User.findOneAndUpdate(
						{
							_id: req.user.id,
							'donationPie.slices.receiverId': newSlice.receiverId
						},
						{ $set: { 'donationPie.slices.$': newSlice } },
						{ new: true, upsert: true }
					);
					user.donationPie.availablePercentage =
						user.donationPie.availablePercentage -
						(newSlice.percentage - initialSlice.percentage);
					await user.save();
					return res.json(user);
				}
			} else {
				if (userDefault.donationPie.availablePercentage < newSlice.percentage) {
					return res.status(400).json({
						errors: [
							{ msg: 'Cannot have a percentage greater than the usable space' }
						]
					});
				}

				const initialSum = userDefault.donationPie.slices
					.map(slice => slice.percentage)
					.reduce((a, b) => a + b, 0);

				const addedSum = newSlice.percentage + initialSum;

				if (addedSum > 100) {
					return res.status(400).json({
						errors: [{ msg: 'Overall percentage cannot be over 100' }]
					});
				} else {
					userDefault.donationPie.slices.unshift(newSlice);
					userDefault.donationPie.availablePercentage =
						userDefault.donationPie.availablePercentage - newSlice.percentage;
					await userDefault.save();
					return res.json(userDefault);
				}
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    DELETE users/user/bank/:bank_id
// @desc     Delete bank from user profile
// @access   Private
router.delete('/user/bank/:bank_id', auth, async (req, res) => {
	try {
		const foundUser = await User.findById(req.user.id);
		const bankIds = foundUser.banks.map(bank => bank._id.toString());
		// if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /experience/5
		const removeIndex = bankIds.indexOf(req.params.bank_id);
		if (removeIndex === -1) {
			return res.status(500).json({ msg: 'Server error' });
		} else {
			// theses console logs helped me figure it out
			console.log('bankIds', bankIds);
			console.log('typeof bankIds', typeof bankIds);
			console.log('req.params', req.params);
			console.log('removed', bankIds.indexOf(req.params.bank_id));
			foundUser.banks.splice(removeIndex, 1);
			await foundUser.save();
			return res.status(200).json(foundUser);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// @route    DELETE users/user/pie/:slice_id
// @desc     Delete slice from profile
// @access   Private
router.delete('/user/pie/:slice_id', auth, async (req, res) => {
	try {
		const foundUser = await User.findById(req.user.id);
		const pieIds = foundUser.donationPie.slices.map(pie => pie._id.toString());
		// if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /experience/5
		const removeIndex = pieIds.indexOf(req.params.slice_id);
		if (removeIndex === -1) {
			return res.status(500).json({ msg: 'Server error' });
		} else {
			const foundSlice = foundUser.donationPie.slices.find(function(slice) {
				return slice._id == req.params.slice_id;
			});
			foundUser.donationPie.availablePercentage =
				foundUser.donationPie.availablePercentage + foundSlice.percentage;
			// theses console logs helped me figure it out
			console.log('bankIds', pieIds);
			console.log('typeof bankIds', typeof pieIds);
			console.log('req.params', req.params);
			console.log('removed', pieIds.indexOf(req.params.bank_id));
			foundUser.donationPie.slices.splice(removeIndex, 1);
			await foundUser.save();

			return res.status(200).json(foundUser);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// @route    GET users/user/pie
// @desc     Get auth user donation pie
// @access   Private
router.get('/user/pie', auth, async (req, res) => {
	try {
		let user = await User.findById(req.user.id);

		let userSlices = [];
		const initialSlice = {
			sliceName: 'Available',
			slicePercentage: user.donationPie.availablePercentage
		};
		userSlices.push(initialSlice);

		user.donationPie.slices.forEach(function(slice) {
			userSlices.push({
				sliceName: slice.receiverName,
				slicePercentage: slice.percentage
			});
		});

		var pieNames = [];
		var pieAmounts = [];
		userSlices.forEach(function(slice) {
			pieNames.push(slice.sliceName);
			pieAmounts.push(slice.slicePercentage.toFixed(2));
		});

		const pieInfo = {
			pieNames,
			pieAmounts
		};

		res.json(pieInfo);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

module.exports = router;
