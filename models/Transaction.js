const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
	giverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	receiverId: {
		type: String,
		required: true
	},
	bankId: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Transaction = mongoose.model(
	'transactions',
	TransactionSchema
);
