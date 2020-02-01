import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { setReceivers } from '../redux/actions/receiversAction';

// Bootstrap
import Card from 'react-bootstrap/Card';

// Components
import Receiver from '../components/Receiver/Receiver';
import LoadingCard from '../components/LoadingCard';

const Search = ({
	receivers: { receiversData, loading },
	selected: { selectedReceiver },
	setReceivers
}) => {
	useEffect(() => {
		setReceivers();
	}, [setReceivers]);

	if (selectedReceiver) {
		return <Redirect to='/dash' />;
	}

	const ReceiverList = loading ? (
		<LoadingCard />
	) : selectedReceiver !== null ? (
		<h1>Already have a receiver selected</h1>
	) : (
		receiversData.map(receiver => (
			<Fragment key={receiver._id}>
				<Receiver
					receiverId={receiver._id}
					receiverName={receiver.name}
					receiverDescription={receiver.description}
					receiverImage={receiver.image}
				/>
			</Fragment>
		))
	);

	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Available Recipients:</h3>
				</Card.Header>
				<Card.Body>{ReceiverList}</Card.Body>
			</Card>
		</Fragment>
	);
};

Search.propTypes = {
	setReceivers: PropTypes.func.isRequired,
	receivers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	receivers: state.receivers,
	selected: state.selected
});

const mapActionsToProps = {
	setReceivers
};

export default connect(mapStateToProps, mapActionsToProps)(Search);
