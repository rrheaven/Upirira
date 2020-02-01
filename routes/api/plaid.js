const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const plaid = require('plaid');
const moment = require('moment');
const stripe = require('stripe')(config.get('STRIPE_TEST_SECRET'));

// Models
const User = require('../../models/User');
const Item = require('../../models/Item');
const Transaction = require('../../models/Transaction');
const Receiver = require('../../models/Receiver');

const PLAID_CLIENT_ID = config.get('PLAID_CLIENT_ID');
const PLAID_SECRET = config.get('PLAID_SECRET');
const PLAID_PUBLIC_KEY = config.get('PLAID_PUBLIC_KEY');
const PLAID_ENV = config.get('PLAID_ENV');

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
			const foundUser = await User.findById(req.user.id);
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

							if (foundUser.stripeData.customerId) {
								await stripe.customers.createSource(
									foundUser.stripeData.customerId,
									{
										source: bankAccountToken
									},
									async (err, source) => {
										if (err != null) {
											return res.status(400).json({
												msg: err
											});
										}

										const newItem = new Item({
											userId: req.user.id,
											accessToken: ACCESS_TOKEN,
											itemId: ITEM_ID,
											accountName: name,
											bankAccountToken: bankAccountToken,
											error: false
										});
										await newItem.save();

										foundUser.stripeData.source = source.id;
										await foundUser.save();

										res.json({
											itemData: newItem,
											userStripeData: foundUser.stripeData
										});
									}
								);
							} else {
								await stripe.customers.create(
									{
										description: 'Upiria Customer',
										source: bankAccountToken
									},
									async (err, customer) => {
										if (err != null) {
											return res.status(400).json({
												msg: err
											});
										}

										const newItem = new Item({
											userId: req.user.id,
											accessToken: ACCESS_TOKEN,
											itemId: ITEM_ID,
											accountName: name,
											bankAccountToken: bankAccountToken,
											error: false
										});
										await newItem.save();

										const newStripeData = {
											customerId: customer.id,
											source: customer.sources.data[0].id
										};

										foundUser.stripeData = newStripeData;
										await foundUser.save();

										res.json({
											itemData: newItem,
											userStripeData: newStripeData
										});
									}
								);
							}
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
		const foundUser = await User.findById(req.user.id);
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

			const foundUser = await User.findById(req.user.id);

			await stripe.customers.deleteSource(
				foundUser.stripeData.customerId,
				foundUser.stripeData.source,
				async (err, confirmation) => {
					if (err) {
						return res.status(400).json({
							msg: err
						});
					}
					foundUser.stripeData.source = undefined;

					await foundUser.save();
					res.json('Item has been deleted');
				}
			);
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
							if (
								transaction.amount > 0 &&
								!Number.isInteger(transaction.amount)
							) {
								let diff = Math.ceil(transaction.amount) - transaction.amount;
								await transactionAmounts.push(diff);
							}
						});
						foundItem.dateLastUpdated = moment();
						await foundItem.save();

						summedTransactions =
							(Math.round(summedTransactions * 1e2) / 1e2) * 100;

						const foundUser = await User.findById(req.user.id);

						if (!foundUser.stripeData.customerId) {
							return res.status(400).json({
								msg: 'User has not registered an account'
							});
						}

						await stripe.charges.create(
							{
								amount: summedTransactions,
								currency: 'usd',
								customer: foundUser.stripeData.customerId,
								source: foundUser.stripeData.source,
								description: 'My First Test Charge (created for API docs)'
							},
							async (err, charge) => {
								if (err != null) {
									return res.status(400).json({
										msg: err
									});
								}

								const newTransaction = new Transaction({
									giverId: req.user.id,
									amount: summedTransactions / 100,
									receiverId: foundUser.selectedReceiverId,
									bankId: foundUser.stripeData.source
								});

								await newTransaction.save();

								res.json(newTransaction);
							}
						);
					}
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route POST api/plaid/test/newCharge
// @desc Post new test charge
// @access Private
router.post('/test/newCharge', auth, async (req, res) => {
	try {
		const foundItem = await Item.findOne({ userId: req.user.id });

		if (!foundItem) {
			return res.status(400).json({
				msg: 'User Item does not exist'
			});
		}

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
						if (
							transaction.amount > 0 &&
							!Number.isInteger(transaction.amount)
						) {
							let diff = Math.ceil(transaction.amount) - transaction.amount;
							await transactionAmounts.push(diff);
						}
					});
					let summedTransactions = transactionAmounts.reduce(
						(a, b) => a + b,
						0
					);

					summedTransactions =
						(Math.round(summedTransactions * 1e2) / 1e2) * 100;

					const foundUser = await User.findById(req.user.id);

					if (!foundUser.stripeData.customerId) {
						return res.status(400).json({
							msg: 'User has not registered an account'
						});
					}

					if (!foundUser.selectedReceiverId) {
						return res.status(400).json({
							msg: 'User has not selected an receiver'
						});
					}

					const foundReceiver = await Receiver.findById(
						foundUser.selectedReceiverId
					);

					await stripe.charges.create(
						{
							amount: summedTransactions,
							currency: 'usd',
							customer: foundUser.stripeData.customerId,
							source: foundUser.stripeData.source,
							description: 'My First Test Charge (created for API docs)',
							transfer_data: {
								amount: summedTransactions,
								destination: foundReceiver.stripe.stripeAccount
							}
						},
						async (err, charge) => {
							if (err != null) {
								return res.status(400).json({
									msg: err
								});
							}

							const newTransaction = new Transaction({
								giverId: req.user.id,
								amount: summedTransactions / 100,
								receiverId: foundUser.selectedReceiverId,
								bankId: foundUser.stripeData.source
							});

							await newTransaction.save();

							res.json(newTransaction);
						}
					);
				}
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
