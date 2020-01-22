const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

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
// @desc Post a receiver
// @access Public
router.post(
	'/receiver',
	[
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check('description', 'Description is required')
			.not()
			.isEmpty(),
		check('image', 'Image is required')
			.not()
			.isEmpty(),
		check('stripeAccount', 'Stripe Account is required')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, description, image, stripeAccount } = req.body;

		try {
			const newReceiver = new Receiver({
				name: name,
				description: description,
				image: image,
				stripe: {
					stripeAccount: stripeAccount
				}
			});

			await newReceiver.save();

			res.json('Receiver Added');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route PUT api/receivers/receiver/:receiver_id
// @desc Update a receiver
// @access Public
router.put(
	'/receiver/:receiver_id',
	[
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check('description', 'Description is required')
			.not()
			.isEmpty(),
		check('image', 'Image is required')
			.not()
			.isEmpty(),
		check('stripeAccount', 'Stripe Account is required')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, description, image, stripeAccount } = req.body;
		const newReceiver = {
			name: name,
			description: description,
			image: image,
			stripe: {
				stripeAccount: stripeAccount
			}
		};

		try {
			await Receiver.replaceOne(
				{
					_id: req.params.receiver_id
				},
				{
					name: name,
					description: description,
					image: image,
					stripe: {
						stripeAccount: stripeAccount
					}
				},
				{ upsert: true }
			);
			res.json('Receiver Added');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
