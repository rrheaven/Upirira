const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const Transaction = require('../../models/Transaction');

// @route GET api/transactions
// @desc Get all user transactions
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const transactions = await Transaction.find({ giverId: req.user.id });

		if (transactions === undefined || transactions.length == 0) {
			return res
				.status(400)
				.json({ msg: 'There are no transactions for this user' });
		}

		res.json(transactions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/transactions/transaction/:transaction_id
// @desc Get specific user transaction
// @access Private
router.get('/transaction/:transaction_id', auth, async (req, res) => {
	try {
		const transaction = await Transaction.findById(req.params.transaction_id);

		if (!transaction) {
			return res.status(400).json({ msg: 'Transaction not found' });
		}

		res.json(transaction);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Transaction not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route POST api/transactions
// @desc Post a user transaction
// @access Private
router.post(
	'/',
	[
		auth,
		[
			check('receiverId', 'ReceiverId is required')
				.not()
				.isEmpty(),
			check('bankId', 'ReceiverId is required')
				.not()
				.isEmpty(),
			check('amount', 'Amount is required')
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { receiverId, bankId, amount } = req.body;

		try {
			const newTransaction = new Transaction({
				giverId: req.user.id,
				receiverId: receiverId,
				bankId: bankId,
				amount: amount
			});

			await newTransaction.save();

			res.json(newTransaction);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
