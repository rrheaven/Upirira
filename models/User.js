const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	selectedReceiverId: {
		type: String
	},
	stripeData: {
		customerId: {
			type: String,
			default: null
		},
		source: {
			type: String,
			default: null
		}
	},
	isReceiver: {
		type: Boolean,
		default: false,
		required: true
	},
	isConfirmed: {
		type: Boolean,
		default: false,
		required: true
	},
	tempData: {
		confirmId: {
			type: String,
			default: null
		},
		passwordId: {
			type: String,
			default: null
		}
	},
	spendingLimit: {
		currentLimit: {
			currentAmountLimit: {
				type: Number,
				default: null
			},
			currentTimePeriodLimit: {
				type: String,
				default: null
			},
			currentTimePeriod: {
				type: Date,
				default: null
			}
		},
		perviousLimit: {
			perviousAmountLimit: {
				type: Number,
				default: null
			},
			perviousTimePeriodLimit: {
				type: String,
				default: null
			},
			perviousTimePeriod: {
				type: Date,
				default: null
			}
		},
		realTimeSpending: {
			type: Number,
			default: 0.0,
			required: true
		}
	}
});

module.exports = User = mongoose.model('user', UserSchema);
