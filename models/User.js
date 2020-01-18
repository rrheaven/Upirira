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
	banks: [
		{
			plaidData: {
				accessToken: {
					type: String,
					required: true
				},
				itemId: {
					type: String,
					required: true
				}
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	donationPie: {
		availablePercentage: {
			type: Number,
			required: true
		},
		slices: [
			{
				percentage: {
					type: Number,
					required: true
				},
				receiverId: {
					type: String,
					required: true
				},
				receiverName: {
					type: String,
					required: true
				}
			}
		]
	}
});

module.exports = User = mongoose.model('user', UserSchema);
