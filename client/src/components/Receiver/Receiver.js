import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

// Component
import AddReceiverModel from './AddReceiverModal';

const Receiver = ({
	receiverId,
	receiverName,
	receiverDescription,
	receiverImage,
	receiverStripe
}) => {
	const [modalShow, setModalShow] = React.useState(false);
	return (
		<Fragment>
			<Card>
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
								<Button variant='link' onClick={() => setModalShow(true)}>
									<FontAwesomeIcon icon={faPlusSquare} size='4x' />
								</Button>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
			<AddReceiverModel
				show={modalShow}
				onHide={() => setModalShow(false)}
				onShow={() => setModalShow(true)}
				name={receiverName}
				id={receiverId}
			/>
		</Fragment>
	);
};

Receiver.propTypes = {
	receiverId: PropTypes.string.isRequired,
	receiverName: PropTypes.string.isRequired,
	receiverDescription: PropTypes.string.isRequired,
	receiverImage: PropTypes.string.isRequired,
	receiverStripe: PropTypes.object.isRequired
};

export default Receiver;
