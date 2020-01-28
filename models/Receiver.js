const mongoose = require('mongoose');

const ReceiverSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	stripe: {
		stripeAccount: {
			type: String,
			required: true
		}
	}
});

module.exports = Receiver = mongoose.model('receivers', ReceiverSchema);
