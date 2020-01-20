const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	accessToken: {
		type: String,
		required: true
	},
	itemId: {
		type: String,
		required: true
	},
	itemName: {
		type: String,
		required: true
	},
	error: {
		type: Boolean,
		required: true
	},
	dateLastUpdated: {
		type: Date,
		default: Date.now
	},
	dateCreated: {
		type: Date,
		default: Date.now
	}
});

module.exports = Item = mongoose.model('items', ItemSchema);
