import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUserFriends,
	faChartArea,
	faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const PrimaryContainer = styled(Container)`
	background: #007bff;
`;

const SecondaryContainer = styled(Container)`
	background: #eceff1;
`;

const Landing = ({ isAuthenticated }) => {
	if (isAuthenticated) {
		return <Redirect to='/dash' />;
	}
	return (
		<Fragment>
			<PrimaryContainer fluid className='text-white py-5'>
				<Row className='py-5' />
				<Row className='py-3 px-5'>
					<Col>
						<h1 class='display-1'>OUR MISSION:</h1>
					</Col>
				</Row>
				<Row className='py-3 px-5'>
					<Col>
						To provide people a better way of supporting local and national
						political figures
					</Col>
				</Row>
				<Row className='py-3 px-5'>
					<Col>
						<Link to='/register'>
							<Button variant='light' className='text-primary'>
								Register
							</Button>
						</Link>
					</Col>
				</Row>
				<Row className='py-4' />
			</PrimaryContainer>
			<SecondaryContainer fluid className='m-5'>
				<Row>
					<Col className='px-5'>
						<Row>
							<FontAwesomeIcon icon={faUserFriends} size='2x' color='#007bff' />
						</Row>
						<Row>
							<h4>Support</h4>
						</Row>
						<Row>
							Conveniently support your favorite politicians and political
							figures
						</Row>
					</Col>
					<Col className='px-5'>
						<Row>
							<FontAwesomeIcon icon={faChartArea} size='2x' color='#007bff' />
						</Row>
						<Row>
							<h4>Track</h4>
						</Row>
						<Row>
							Our dash tools allow you to easily track how much you are spending
						</Row>
					</Col>
					<Col className='px-5'>
						<Row>
							<FontAwesomeIcon icon={faShieldAlt} size='2x' color='#007bff' />
						</Row>
						<Row>
							<h4>Secure</h4>
						</Row>
						<Row>We provide a secure method of transacting currency</Row>
					</Col>
				</Row>
			</SecondaryContainer>
		</Fragment>
	);
};

Landing.propTypes = {
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
