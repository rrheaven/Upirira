import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';

const ChangePassword = ({ auth: { loading, user }, history }) => {
	const handleClick = () => {
		!loading && history.push(`/newPassword/${user._id}`);
	};

	return (
		<Fragment>
			<Button onClick={handleClick}>Change Password</Button>
		</Fragment>
	);
};

ChangePassword.propTypes = {
	auth: PropTypes.object
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(withRouter(ChangePassword));
