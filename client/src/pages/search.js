import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import { setUnselectedReceivers } from '../redux/actions/receiversAction';

// Bootstrap
import Card from 'react-bootstrap/Card';

// Components
import Receiver from '../components/Receiver/Receiver';

const Search = ({
	receivers: { receiversData, loading },
	setUnselectedReceivers
}) => {
	useEffect(() => {
		setUnselectedReceivers();
	}, [setUnselectedReceivers]);

	const ReceiverList = loading ? (
		<h1>Loading</h1>
	) : (
		receiversData.map(receiver => (
			<Fragment key={receiver._id}>
				<Receiver
					receiverId={receiver._id}
					receiverName={receiver.name}
					receiverDescription={receiver.description}
					receiverImage={receiver.image}
					receiverStripe={receiver.stripe}
				/>
			</Fragment>
		))
	);

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>Available Recipients: </Card.Title>
					{ReceiverList}
				</Card.Body>
			</Card>
		</Fragment>
	);
};

Search.propTypes = {
	setUnselectedReceivers: PropTypes.func.isRequired,
	receivers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	receivers: state.receivers
});

const mapActionsToProps = {
	setUnselectedReceivers
};

export default connect(mapStateToProps, mapActionsToProps)(Search);
