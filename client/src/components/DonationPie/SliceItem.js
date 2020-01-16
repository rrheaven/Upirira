import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { deletePieSlice } from '../../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// Components
import EditSliceModal from './EditSliceModal';

const SliceItem = ({ pieName, pieAmount, pieId, pieDB_ID, deletePieSlice }) => {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<Fragment>
			<Card.Body>
				<Container>
					<Row>
						<Col sm={8}>
							{pieName} - {pieAmount}%
						</Col>
						<Col sm={4}>
							{pieName !== 'Available' && (
								<Fragment>
									<Button variant='link' onClick={() => setModalShow(true)}>
										<FontAwesomeIcon icon={faEdit} size='lg' />
									</Button>
									<Button
										variant='link'
										onClick={() => deletePieSlice(pieDB_ID)}
									>
										<FontAwesomeIcon icon={faTrashAlt} size='lg' color='red' />
									</Button>
									<EditSliceModal
										show={modalShow}
										onHide={() => setModalShow(false)}
										onShow={() => setModalShow(true)}
										pie_id={pieId}
										pie_name={pieName}
										pie_amount={pieAmount}
									/>
								</Fragment>
							)}
						</Col>
					</Row>
				</Container>
			</Card.Body>
		</Fragment>
	);
};

SliceItem.propTypes = {
	pieId: PropTypes.string.isRequired,
	pieName: PropTypes.string.isRequired,
	pieAmount: PropTypes.number.isRequired,
	pieDB_ID: PropTypes.string,
	deletePieSlice: PropTypes.func.isRequired
};

const mapActionsToProps = {
	deletePieSlice
};

export default connect(null, mapActionsToProps)(SliceItem);
