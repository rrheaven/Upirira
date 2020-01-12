const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const Transaction = require('../../models/Transaction');

// utils
const {
	getBeginningOfDayDate,
	getBeginningOfWeekDate,
	getBeginningOfMonthDate,
	getBeginningOfYearDate
} = require('../../utils/dateFunctions');

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

// @route POST api/transactions/transaction
// @desc Post a user transaction
// @access Private
router.post(
	'/transaction',
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

// @route GET api/transactions/metrics
// @desc Get user transaction metrics
// @access Private
router.get('/metrics', auth, async (req, res) => {
	DayDate = getBeginningOfDayDate();
	WeekDate = getBeginningOfWeekDate();
	MonthDate = getBeginningOfMonthDate();
	YearDate = getBeginningOfYearDate();
	try {
		const transactions = await Transaction.find({ giverId: req.user.id });

		if (transactions === undefined || transactions.length == 0) {
			return res
				.status(400)
				.json({ msg: 'There are no transactions for this user' });
		}

		// Get one day transaction sum
		const dayTransactions = await Transaction.find({
			$and: [{ giverId: req.user.id }, { date: { $gte: DayDate } }]
		});
		const daySum = dayTransactions
			.map(transaction => transaction.amount)
			.reduce((sum, current) => sum + current, 0);

		// Get one week transaction sum
		const weekTransactions = await Transaction.find({
			$and: [{ giverId: req.user.id }, { date: { $gte: WeekDate } }]
		});
		const weekSum = weekTransactions
			.map(transaction => transaction.amount)
			.reduce((sum, current) => sum + current, 0);

		// Get one month transaction sum
		const monthTransactions = await Transaction.find({
			$and: [{ giverId: req.user.id }, { date: { $gte: MonthDate } }]
		});
		const monthSum = monthTransactions
			.map(transaction => transaction.amount)
			.reduce((sum, current) => sum + current, 0);

		// Get one year transaction sum
		const yearTransactions = await Transaction.find({
			$and: [{ giverId: req.user.id }, { date: { $gte: YearDate } }]
		});
		const yearSum = yearTransactions
			.map(transaction => transaction.amount)
			.reduce((sum, current) => sum + current, 0);

		transactionMetrics = {
			oneDayTotal: daySum,
			oneWeekTotal: weekSum,
			oneMonthTotal: monthSum,
			oneYearTotal: yearSum
		};

		res.json(transactionMetrics);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
