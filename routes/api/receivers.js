const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')('sk_test_YBsqxxWL4vvE3by5E8YCwePl00BpFDvspm');

// Models
const Receiver = require('../../models/Receiver');
const User = require('../../models/User');

// @route GET api/receivers
// @desc Get all receivers
// @access Public
router.get('/', async (req, res) => {
	try {
		const receivers = await Receiver.find();
		res.json(receivers);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/receivers/receiver
// @desc Get user's receiver info
// @access private
router.get('/receiver', auth, async (req, res) => {
	const foundReceivers = await Receiver.findOne({ userId: req.user.id });
	try {
		foundReceivers ? res.json(foundReceivers) : res.json(null);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/receivers/receiver
// @desc Add/Update a receiver
// @access Public
router.post(
	'/receiver',
	[
		auth,
		[
			check('firstName', 'First name is required')
				.not()
				.isEmpty(),
			check('lastName', 'Last name is required')
				.not()
				.isEmpty(),
			check('description', 'Description is required')
				.not()
				.isEmpty(),
			check('image', 'Image is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const foundReceiver = await Receiver.findOne({ userId: req.user.id });

		const { firstName, lastName, description, image } = req.body;
		const name = firstName + ' ' + lastName;

		try {
			await Receiver.replaceOne(
				{
					userId: req.user.id
				},
				{
					userId: req.user.id,
					name: name,
					description: description,
					image: image,
					stripe: {
						stripeAccount: foundReceiver.stripe.stripeAccount
					}
				},
				{ upsert: true }
			);
			return res.status(200).json({
				msg: 'Receiver Updated'
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route POST api/receivers/receiver/id
// @desc Post user's receiver stripe id
// @access private
router.post('/receiver/id', auth, async (req, res) => {
	try {
		stripe.oauth
			.token({
				grant_type: 'authorization_code',
				code: 'ac_Gdg6H4CP95S3RM4j6NT12U1e7NWF32eI'
			})
			.then(async response => {
				// asynchronously called
				var connected_account_id = await response.stripe_user_id;

				const foundUser = await User.findById(req.user.id);

				const newReceiver = new Receiver({
					userId: req.user.id,
					name: foundUser.firstName + ' ' + foundUser.lastName,
					description: 'Test Description',
					image:
						'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif',
					stripe: {
						stripeAccount: connected_account_id
					}
				});

				await newReceiver.save();

				return res.status(200).json({
					msg: 'Receiver Added'
				});
			});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route POST api/receivers/receiver/dash
// @desc Post user's receiver dash
// @access private
router.post('/receiver/dash', auth, async (req, res) => {
	const foundReceivers = await Receiver.findOne({ userId: req.user.id });
	try {
		await stripe.accounts.createLoginLink(
			foundReceivers.stripe.stripeAccount,
			async function(err, link) {
				// asynchronously called
				res.json(link.url);
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/receivers/receiver/auth
// @desc Get user auth
// @access private
router.get('/receiver/auth', auth, async (req, res) => {
	try {
		// req.session.state = Math.random()
		// 	.toString(36)
		// 	.slice(2);

		// let parameters = {
		// 	client_id: 'ca_GczqET5WCUcwzeU5oBZPun5CWnm9uvvt',
		// 	state: req.session.state
		// };
		// parameters = Object.assign(parameters, {
		// 	'stripe_user[business_type]': req.user.type || 'individual',
		// 	'stripe_user[business_name]': req.user.businessName || undefined,
		// 	'stripe_user[first_name]': req.user.firstName || undefined,
		// 	'stripe_user[last_name]': req.user.lastName || undefined,
		// 	'stripe_user[email]': req.user.email || undefined,
		// 	'stripe_user[country]': req.user.country || undefined
		// 	// If we're suggesting this account have the `card_payments` capability,
		// 	// we can pass some additional fields to prefill:
		// 	// 'suggested_capabilities[]': 'card_payments',
		// 	// 'stripe_user[street_address]': req.user.address || undefined,
		// 	// 'stripe_user[city]': req.user.city || undefined,
		// 	// 'stripe_user[zip]': req.user.postalCode || undefined,
		// 	// 'stripe_user[state]': req.user.city || undefined,
		// });
		res.redirect('https://www.google.com');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
