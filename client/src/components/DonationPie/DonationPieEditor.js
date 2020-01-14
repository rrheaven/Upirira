import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const DonationPieEditor = ({
	pie: {
		pieData: { pieNames, pieAmounts }
	}
}) => {
	const PieSlices = pieNames.map((val, index) => (
		<Card.Body key={val}>
			<Container>
				<Row>
					<Col sm={8}>
						{val} - {pieAmounts[index]}%
					</Col>
					<Col sm={4}>
						{val !== 'Available' && (
							<Fragment>
								<Button variant='link'>
									<FontAwesomeIcon icon={faEdit} size='lg' />
								</Button>
								<Button variant='link'>
									<FontAwesomeIcon icon={faTrashAlt} size='lg' color='red' />
								</Button>
							</Fragment>
						)}
					</Col>
				</Row>
			</Container>
		</Card.Body>
	));

	// console.log(p);

	return (
		<Fragment>
			<Card>{PieSlices}</Card>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	pie: state.pie
});

DonationPieEditor.propTypes = {
	pie: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(DonationPieEditor);
