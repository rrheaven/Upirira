import React, { Fragment } from 'react';

// Redux
import { connect } from 'react-redux';
import { deletePlaidItem } from '../../redux/actions/plaidAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Item = ({
	plaid: {
		plaidItems: { _id, itemName },
		loading
	},
	deletePlaidItem
}) => {
	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Container>
						<Row>
							<Col sm={11}>
								<Card.Title>
									{loading ? (
										<h1>Loading</h1>
									) : (
										itemName !== null && <h3>{itemName}</h3>
									)}
								</Card.Title>
							</Col>
							<Col sm={1}>
								<Button variant='link' onClick={() => deletePlaidItem(_id)}>
									<FontAwesomeIcon icon={faTrashAlt} size='lg' color='red' />
								</Button>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	plaid: state.plaid
});

const mapActionsToProps = {
	deletePlaidItem
};

export default connect(mapStateToProps, mapActionsToProps)(Item);
