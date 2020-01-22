const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const plaid = require('plaid');
const moment = require('moment');

// Models
const User = require('../../models/User');
const Item = require('../../models/Item');

const PLAID_CLIENT_ID = '5e2654f912884a00139b98bc';
const PLAID_SECRET = '2d132c7f7ebe7a5fcc76cccc3b6aad';
const PLAID_PUBLIC_KEY = '18d9205e9c8060e88c9d25163276e6';
const PLAID_ENV = 'sandbox';

// Initialize the Plaid client
const client = new plaid.Client(
	PLAID_CLIENT_ID,
	PLAID_SECRET,
	PLAID_PUBLIC_KEY,
	plaid.environments[PLAID_ENV]
);

// @route POST api/plaid/auth/public_token
// @desc Get the public token and exchange it for an access token and store it for user
// @access Private
router.post(
	'/auth/public_token',
	[
		auth,
		[
			check('publicToken', 'Must provide Public Token')
				.not()
				.isEmpty(),
			check('accountId', 'Must provide Account Id')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { publicToken, accountId, name } = req.body;

		try {
			const foundItem = await Item.findOne({ userId: req.user.id });

			if (foundItem) {
				return res.status(400).json({
					msg:
						'User has already registered bank. Delete before adding another one'
				});
			}

			// First, receive the public token and set it to a variable
			const PUBLIC_TOKEN = publicToken;

			// Second, exchange the public token for an access token
			await client.exchangePublicToken(
				PUBLIC_TOKEN,
				async (error, tokenResponse) => {
					if (error != null) {
						var msg = 'Could not exchange public_token!';
						console.log(msg + '\n' + JSON.stringify(error));
						return res.status(400).json({
							msg: msg
						});
					}

					const ACCESS_TOKEN = tokenResponse.access_token;
					const ITEM_ID = tokenResponse.item_id;

					await client.createStripeToken(
						ACCESS_TOKEN,
						accountId,
						async (err, result) => {
							if (err != null) {
								return res.status(400).json({
									msg: err
								});
							}

							const bankAccountToken = result.stripe_bank_account_token;

							const newItem = new Item({
								userId: req.user.id,
								accessToken: ACCESS_TOKEN,
								itemId: ITEM_ID,
								accountName: name,
								bankAccountToken: bankAccountToken,
								error: false
							});

							await newItem.save();

							res.json(newItem);
						}
					);
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route    DELETE plaid/user/bank/:bank_id
// @desc     Delete bank from user profile
// @access   Private
router.delete('/user/item/:item_id', auth, async (req, res) => {
	try {
		const foundItem = await Item.findById(req.params.item_id);
		if (!foundItem) {
			return res.status(400).json({
				msg: 'Item does not exist or has already been deleted'
			});
		}

		const ACCESS_TOKEN = foundItem.accessToken;

		await client.removeItem(ACCESS_TOKEN, async (err, result) => {
			if (err != null) {
				return res.status(400).json({
					msg: err
				});
			}

			await Item.deleteOne({ _id: req.params.item_id }, err => {
				if (err) {
					return res.status(400).json({
						msg: 'Item does not exist or has already been deleted'
					});
				}
			});

			res.json('Item has been deleted');
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'Server error' });
	}
});

// @route GET api/plaid/user/items
// @desc Get registered user items
// @access Private
router.get('/user/items', auth, async (req, res) => {
	try {
		const foundItem = await Item.findOne({ userId: req.user.id });

		if (!foundItem) {
			return res.status(400).json({
				msg: 'User Item does not exist'
			});
		}

		res.json(foundItem);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/plaid/transactions
// @desc Get Transactions
// @access Private
router.get('/transactions', auth, async (req, res) => {
	try {
		const foundItem = await Item.findOne({ userId: req.user.id });

		if (!foundItem) {
			return res.status(400).json({
				msg: 'User Item does not exist'
			});
		}

		const user = await User.findById(req.user.id);
		const ACCESS_TOKEN = foundItem.accessToken;

		// Pull transactions for the last 30 days
		let startDate = moment()
			.subtract(30, 'days')
			.format('YYYY-MM-DD');
		let endDate = moment().format('YYYY-MM-DD');

		await client.getTransactions(
			ACCESS_TOKEN,
			startDate,
			endDate,
			{
				count: 250,
				offset: 0
			},
			async (error, transactionsResponse) => {
				if (error != null) {
					return res.status(400).json({
						msg: error
					});
				} else {
					let transactionAmounts = [];
					transactionsResponse.transactions.map(async transaction => {
						await transactionAmounts.push(transaction.amount);
					});
					res.json(transactionAmounts);
				}
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route Post api/plaid/webhooks
// @desc Post plaid item transactions based on update webhook
// @access Public
router.post(
	'/webhooks',
	[
		check('webhook_type', 'webhook_type is required')
			.not()
			.isEmpty(),
		check('webhook_code', 'webhook_code is required')
			.not()
			.isEmpty(),
		check('item_id', 'item_id is required')
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			webhook_type,
			webhook_code,
			item_id,
			error,
			new_transactions
		} = req.body;

		try {
			if (webhook_type !== 'TRANSACTIONS') {
				return res.status(400).json({ msg: 'Webhook only for transactions' });
			}

			if (webhook_code !== 'DEFAULT_UPDATE') {
				return res
					.status(400)
					.json({ msg: 'Webhook only for new transactions' });
			}

			const foundItem = await Item.findOne({ itemId: item_id });

			if (!foundItem) {
				return res.status(400).json({
					msg: 'Item does not exist'
				});
			}

			const ACCESS_TOKEN = foundItem.accessToken;

			let startDate = moment(foundItem.dateLastUpdated).format('YYYY-MM-DD');
			let endDate = moment().format('YYYY-MM-DD');

			await client.getTransactions(
				ACCESS_TOKEN,
				startDate,
				endDate,
				{
					count: 250,
					offset: 0
				},
				async (error, transactionsResponse) => {
					if (error != null) {
						return res.status(400).json({
							msg: error
						});
					} else {
						let transactionAmounts = [];
						transactionsResponse.transactions.map(async transaction => {
							await transactionAmounts.push(transaction.amount);
						});
						foundItem.dateLastUpdated = moment();
						await foundItem.save();

						res.json(transactionAmounts);
					}
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
