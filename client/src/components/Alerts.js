import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Bootstrap
import Alert from 'react-bootstrap/Alert';

const Alerts = ({ alerts }) => {
	return (
		<Fragment>
			{alerts !== null &&
				alerts.length > 0 &&
				alerts.map(alert => (
					<Alert key={alert.id} variant={`${alert.alertType}`}>
						{alert.msg}
					</Alert>
				))}
		</Fragment>
	);
};

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	alerts: state.alert
});

export default connect(mapStateToProps)(Alerts);
