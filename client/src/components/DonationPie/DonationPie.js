import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

//Components
import PieChart from './DonationPieChart';
import PieEditor from './DonationPieEditor';

// Redux
import { connect } from 'react-redux';
import { setPie } from '../../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DonationPie = ({ setPie }) => {
	useEffect(() => {
		setPie();
	}, [setPie]);

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>My Percentages:</Card.Title>
					<Container>
						<Row>
							<Col sm={7}>
								<Card.Body>
									<PieChart />
								</Card.Body>
							</Col>
							<Col sm={5}>
								<Card.Body>
									<PieEditor />
								</Card.Body>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

DonationPie.propTypes = {
	setPie: PropTypes.func.isRequired
};

const mapActionsToProps = {
	setPie
};

export default connect(null, mapActionsToProps)(DonationPie);
