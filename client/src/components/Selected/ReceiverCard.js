import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { deleteSelected } from '../../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ReceiverCard = ({
	receiverId,
	receiverName,
	receiverDescription,
	receiverImage,
	deleteSelected
}) => {
	return (
		<Fragment>
			<Card className='shadow-sm'>
				<Card.Body>
					<Container>
						<Row>
							<Col sm={2}>
								<Image src={receiverImage} rounded fluid />
							</Col>
							<Col sm={9}>
								<Row>
									<Card.Title>{receiverName}</Card.Title>
								</Row>
								<Row>
									<Card.Text>{receiverDescription}</Card.Text>
								</Row>
							</Col>
							<Col sm={1}>
								<Button
									variant='link'
									onClick={() => deleteSelected(receiverId)}
									className='mt-4 mb-1'
								>
									<FontAwesomeIcon icon={faTrashAlt} size='4x' color='red' />
								</Button>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

ReceiverCard.propTypes = {
	receiverId: PropTypes.string.isRequired,
	receiverName: PropTypes.string.isRequired,
	receiverDescription: PropTypes.string.isRequired,
	receiverImage: PropTypes.string.isRequired,
	deleteSelected: PropTypes.func.isRequired
};

const mapActionsToProps = {
	deleteSelected
};

export default connect(null, mapActionsToProps)(ReceiverCard);
