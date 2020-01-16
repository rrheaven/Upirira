import React, { Fragment } from 'react';

// Redux
import { connect } from 'react-redux';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Components
import Alerts from '../Alerts';

const AddReceiverModal = props => {
	let loading = props.auth.loading;
	let availablePercentage =
		!loading &&
		props.auth.user &&
		props.auth.user.donationPie.availablePercentage;

	return (
		<Fragment>
			<Modal
				{...props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id='contained-modal-title-vcenter'>
						{`Add: ${props.name}`}
					</Modal.Title>
				</Modal.Header>
				<Form>
					<Modal.Body>
						<Alerts />
						<Form.Group controlId='formGridAddress1'>
							<Form.Label>
								{
									<h6>{`Available Percentage: ${availablePercentage.toFixed(
										2
									)}`}</h6>
								}
							</Form.Label>
							<Form.Control
								type='number'
								placeholder={'Enter percentage'}
								name='percentage'
							/>
						</Form.Group>
						<Button onClick={props.onHide}>Close</Button>
					</Modal.Body>
				</Form>
			</Modal>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	alerts: state.alert,
	auth: state.auth
});

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(AddReceiverModal);
