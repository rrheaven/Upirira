const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    GET api/profile/user
// @desc     Get current users profile
// @access   Private
router.get('/user', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate('user', ['firstName', 'lastName']);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    Post api/profile/user
// @desc     Create empty user profile
// @access   Private
router.post('/user', auth, async (req, res) => {
	try {
		let profile = await Profile.findOne({ user: req.user.id });

		if (profile) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'Profile for user already exists' }] });
		}

		const newProfile = new Profile({
			user: req.user.id
		});

		profile = await newProfile.save();

		res.json(profile);
	} catch (error) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    Post api/profile/user/bank
// @desc     Add bank to profile
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
			const profile = await Profile.findOne({ user: req.user.id });
			profile.banks.unshift(newBank);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    Post api/profile/user/pie
// @desc     Add slice to donation pie
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
			const profile = await Profile.findOne({ user: req.user.id });
			profile.donationPie.unshift(newSlice);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
