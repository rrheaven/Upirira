const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const plaid = require('plaid');
const moment = require('moment');

// Models
const User = require('../../models/User');

const PLAID_CLIENT_ID = '5d8c3dcb1489d00016334730';
const PLAID_SECRET = 'a251c86f54c49f1deb72bf41ee3c3a';
const PLAID_PUBLIC_KEY = 'af1c94dd61a2b5afaad2a5023a24ae';
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
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { publicToken } = req.body;

		try {
			// First, receive the public token and set it to a variable
			const PUBLIC_TOKEN = publicToken;

			// Second, exchange the public token for an access token
			await client.exchangePublicToken(
				publicToken,
				async (error, tokenResponse) => {
					const ACCESS_TOKEN = tokenResponse.access_token;
					const ITEM_ID = tokenResponse.item_id;

					const plaidData = { accessToken: ACCESS_TOKEN, itemId: ITEM_ID };

					const newBank = {
						plaidData: plaidData
					};

					const user = await User.findById(req.user.id);
					user.banks.unshift(newBank);

					await user.save();

					res.json(user);
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

// // @route GET api/plaid/transactions
// // @desc Get Transactions
// // @access Public
// router.get('/transactions', async (req, res) => {
// 	try {
// 		// Pull transactions for the last 30 days
// 		let startDate = moment()
// 			.subtract(30, 'days')
// 			.format('YYYY-MM-DD');
// 		let endDate = moment().format('YYYY-MM-DD');
// 		console.log('made it past variables');
// 		client.getTransactions(
// 			ACCESS_TOKEN,
// 			startDate,
// 			endDate,
// 			{
// 				count: 250,
// 				offset: 0
// 			},
// 			function(error, transactionsResponse) {
// 				res.json({ transactions: transactionsResponse });
// 				// TRANSACTIONS LOGGED BELOW!
// 				// They will show up in the terminal that you are running nodemon in.
// 				console.log(transactionsResponse);
// 			}
// 		);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send('Server Error');
// 	}
// });

module.exports = router;
