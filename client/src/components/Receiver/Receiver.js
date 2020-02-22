import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { addSelected } from '../../redux/actions/profileAction';

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

const Receiver = ({
	receiverId,
	receiverName,
	receiverDescription,
	receiverImage,
	addSelected
}) => {
	const handleClick = receiverId => {
		addSelected({ receiverId: receiverId });
	};

	return (
		<Fragment>
			<Card className='my-3 shadow-sm'>
				<Card.Body>
					<Container className={'container h-100'}>
						<Row className={'h-100 justify-content-center align-items-center'}>
							<Col sm={2}>
								<Image src={receiverImage} rounded fluid />
							</Col>
							<Col sm={8} className='my-4'>
								<Row>
									<Card.Title>{receiverName}</Card.Title>
								</Row>
								<Row>
									<Card.Text>{receiverDescription}</Card.Text>
								</Row>
							</Col>
							<Col sm={2}>
								<Button
									variant='primary btn-block'
									onClick={() => handleClick(receiverId)}
								>
									Add
								</Button>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

Receiver.propTypes = {
	receiverId: PropTypes.string.isRequired,
	receiverName: PropTypes.string.isRequired,
	receiverDescription: PropTypes.string.isRequired,
	receiverImage: PropTypes.string.isRequired,
	addSelected: PropTypes.func.isRequired
};

const mapActionsToProps = { addSelected };

export default connect(null, mapActionsToProps)(Receiver);
