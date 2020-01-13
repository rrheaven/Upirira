const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const _ = require('lodash');
const moment = require('moment');

// Models
const Transaction = require('../../models/Transaction');

// utils
const {
	getBeginningOfDayDate,
	getBeginningOfWeekDate,
	getBeginningOfMonthDate,
	getBeginningOfYearDate,
	getDays
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

// @route GET api/transactions/week
// @desc Get user transactions totals for each day for a week
// @access Private
router.get('/week', auth, async (req, res) => {
	WeekDate = getBeginningOfWeekDate();
	var daysOfWeek = getDays(WeekDate, new Date(Date.now()));
	try {
		const transactions = await Transaction.find(
			{
				$and: [{ giverId: req.user.id }, { date: { $gte: WeekDate } }]
			},
			{ _id: 0, amount: 1, date: 1 }
		);

		var weekMaps = [];
		transactions.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('day')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				weekMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		weekMaps = weekMaps.reverse().concat(daysOfWeek);

		var wMaps = [];
		weekMaps.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('day')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				wMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		wMaps = wMaps.sort((a, b) => new Date(a.date) - new Date(b.date));

		var graphDates = [];
		var graphAmounts = [];
		wMaps.forEach(function(wMap) {
			graphDates.push(moment(wMap.date).format('MM/DD'));
			graphAmounts.push(wMap.amount.toFixed(2));
		});

		const graphInfo = {
			graphTitle: 'By Week Transactions',
			graphDates,
			graphAmounts
		};
		res.json(graphInfo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/transactions/month
// @desc Get user transactions totals for each day for a month
// @access Private
router.get('/month', auth, async (req, res) => {
	MonthDate = getBeginningOfMonthDate();
	var daysOfMonth = getDays(MonthDate, new Date(Date.now()));
	try {
		const transactions = await Transaction.find(
			{
				$and: [{ giverId: req.user.id }, { date: { $gte: MonthDate } }]
			},
			{ _id: 0, amount: 1, date: 1 }
		);

		var monthMaps = [];
		transactions.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('day')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				monthMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		monthMaps = monthMaps.concat(daysOfMonth);

		var mMaps = [];
		monthMaps.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('day')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				mMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		mMaps = mMaps.sort((a, b) => new Date(a.date) - new Date(b.date));

		var graphDates = [];
		var graphAmounts = [];
		mMaps.forEach(function(mMap) {
			graphDates.push(moment(mMap.date).format('MM/DD'));
			graphAmounts.push(mMap.amount.toFixed(2));
		});

		const graphInfo = {
			graphTitle: 'By Month Transactions',
			graphDates,
			graphAmounts
		};
		res.json(graphInfo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/transactions/year
// @desc Get user transactions totals for each month for a year
// @access Private
router.get('/year', auth, async (req, res) => {
	YearDate = getBeginningOfYearDate();
	var daysOfYear = getDays(YearDate, new Date(Date.now()));
	try {
		const transactions = await Transaction.find(
			{
				$and: [{ giverId: req.user.id }, { date: { $gte: YearDate } }]
			},
			{ _id: 0, amount: 1, date: 1 }
		);

		var yearMaps = [];
		transactions.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('month')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				yearMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		yearMaps = yearMaps.concat(daysOfYear);

		var yMaps = [];
		yearMaps.reduce(function(res, value) {
			formatedDate = moment(value.date)
				.startOf('month')
				.format();
			if (!res[formatedDate]) {
				res[formatedDate] = { date: formatedDate, amount: 0 };
				yMaps.push(res[formatedDate]);
			}
			res[formatedDate].amount += value.amount;
			return res;
		}, {});

		yMaps = yMaps.sort((a, b) => new Date(a.date) - new Date(b.date));

		var graphDates = [];
		var graphAmounts = [];
		yMaps.forEach(function(yMap) {
			graphDates.push(moment(yMap.date).format('MMMM'));
			graphAmounts.push(yMap.amount.toFixed(2));
		});

		const graphInfo = {
			graphTitle: 'By Yearly Transactions',
			graphDates,
			graphAmounts
		};

		res.json(graphInfo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
