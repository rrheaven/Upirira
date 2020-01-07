const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	bankId: [
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
			recieverId: {
				type: String,
				required: true
			},
			recieverName: {
				type: String,
				required: true
			}
		}
	]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
