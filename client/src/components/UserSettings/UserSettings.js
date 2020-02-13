import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const UserSettings = ({ auth: { loading, user }, history }) => {
	const handleClick = () => {
		!loading && history.push(`/newPassword/${user._id}`);
	};

	return (
		<Fragment>
			<h6>User Settings:</h6>
			<Card className='shadow-sm'>
				<Card.Body>
					<Button onClick={handleClick}>Change Password</Button>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

UserSettings.propTypes = {
	auth: PropTypes.object
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(withRouter(UserSettings));
