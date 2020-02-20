import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const SetSpendLimitModal = props => {
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
						Set Spending Limit:
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Row>
							<Form.Group as={Col} controlId='formAmount'>
								<Form.Label>Amount Limit:</Form.Label>
								<Form.Control as='select' value='$5'>
									<option>$5</option>
									<option>$10</option>
									<option>$15</option>
									<option>$20</option>
									<option>$25</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId='formTimePeriod'>
								<Form.Label>Time Period Limit:</Form.Label>
								<Form.Control as='select' value='Per Week'>
									<option>Per Week</option>
									<option>Per Month</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<div className={'text-right'}>
							<Button variant='primary' type='submit'>
								Set
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Fragment>
	);
};

SetSpendLimitModal.propTypes = {};

export default SetSpendLimitModal;
