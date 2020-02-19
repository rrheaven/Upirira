import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { sendChangePasswordEmail } from '../../redux/actions/passwordAction';

// Bootstrap
import Button from 'react-bootstrap/Button';

const ChangePassword = ({
	auth: { loading, user },
	sendChangePasswordEmail
}) => {
	const handleClick = () => {
		if (!loading) {
			const email = user.email;
			sendChangePasswordEmail({ email });
		}
	};

	return (
		<Fragment>
			<Button onClick={handleClick}>Send Change Password Email</Button>
		</Fragment>
	);
};

ChangePassword.propTypes = {
	auth: PropTypes.object,
	sendChangePasswordEmail: PropTypes.func
};

const mapStateToProps = state => ({
	auth: state.auth
});

const mapActionsToProps = {
	sendChangePasswordEmail
};

export default connect(mapStateToProps, mapActionsToProps)(ChangePassword);
