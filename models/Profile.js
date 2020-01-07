const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	banks: [
		{
			bankId: {
				type: String,
				required: true
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	donationPie: [
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
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
