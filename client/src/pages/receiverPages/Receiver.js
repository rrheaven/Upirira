import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import { setUserReceiver } from '../../redux/actions/receiversAction';

// Components
import UpdateReceiver from './UpdateReceiver';
import ReceiverDash from './ReceiverDash';
import AddReceiver from './AddReceiver';

// Bootstrap
import Card from 'react-bootstrap/Card';

const Receiver = ({ userReceiver, loading, setUserReceiver, dashLink }) => {
	useEffect(() => {
		setUserReceiver();
	}, [setUserReceiver]);

	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Receiver Info</h3>
				</Card.Header>
				<Card.Body>
					{!loading && !userReceiver && <AddReceiver />}
					{!loading && userReceiver && (
						<Fragment>
							{dashLink && <ReceiverDash dashLink={dashLink} />}
							<UpdateReceiver />
						</Fragment>
					)}
				</Card.Body>
			</Card>
		</Fragment>
	);
};

Receiver.propTypes = {
	setUserReceiver: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	userReceiver: PropTypes.object,
	dashLink: PropTypes.string
};

const mapStateToProps = state => ({
	userReceiver: state.receivers.userReceiver,
	dashLink: state.receivers.dashLink,
	loading: state.receivers.loading
});

const mapActionsToProps = {
	setUserReceiver
};

export default connect(mapStateToProps, mapActionsToProps)(Receiver);
