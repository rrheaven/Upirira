const nodemailer = require('nodemailer');
const config = require('config');

const credentials = {
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: config.get('EMAIL_USER'),
		pass: config.get('EMAIL_PASSWORD')
	}
};

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {
	const contacts = {
		from: config.get('EMAIL_USER'),
		to
	};

	const email = Object.assign({}, content, contacts);

	await transporter.sendMail(email);
};
