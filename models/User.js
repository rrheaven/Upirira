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
	}
});

module.exports = User = mongoose.model('user', UserSchema);
