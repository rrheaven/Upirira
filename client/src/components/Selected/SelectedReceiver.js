import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { setSelected } from '../../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Components
import ReceiverCard from './ReceiverCard';

const SelectedReceiver = ({
	selected: { selectedReceiver, loading },
	setSelected
}) => {
	useEffect(() => {
		setSelected();
	}, [setSelected]);

	const select = (
		<Fragment>
			<Card.Body>
				<Card.Title>Select Receiver:</Card.Title>
				<Link to='/search'>
					<Button>Add Receiver</Button>
				</Link>
			</Card.Body>
		</Fragment>
	);
	const selected = (
		<Fragment>
			<Card.Body>
				<Card.Title>Selected Receiver:</Card.Title>
				{!loading && selectedReceiver !== null && (
					<ReceiverCard
						receiverId={selectedReceiver._id}
						receiverName={selectedReceiver.name}
						receiverDescription={selectedReceiver.description}
						receiverImage={selectedReceiver.image}
					/>
				)}
			</Card.Body>
		</Fragment>
	);

	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				{!loading && (
					<Fragment>{selectedReceiver === null ? select : selected}</Fragment>
				)}
			</Card>
		</Fragment>
	);
};

SelectedReceiver.propTypes = {
	setSelected: PropTypes.func.isRequired,
	selected: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	selected: state.selected
});

const mapActionsToProps = {
	setSelected
};

export default connect(mapStateToProps, mapActionsToProps)(SelectedReceiver);
