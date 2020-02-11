const config = require('config');

module.exports = {
	confirmationEmail: id => ({
		subject: 'Confirm your Upiria account',
		html: `
			<a href='${config.get('CLIENT_ORIGIN')}/confirm/${id}'>
				click to confirm email
			</a>
		`,
		text: `Copy and paste this link: ${config.get(
			'CLIENT_ORIGIN'
		)}/confirm/${id}`
	})
};
