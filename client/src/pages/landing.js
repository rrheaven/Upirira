import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

// Bootstrap
import Card from 'react-bootstrap/Card';

const Landing = ({ isAuthenticated }) => {
	if (isAuthenticated) {
		return <Redirect to='/dash' />;
	}
	return (
		<Fragment>
			<Card className='bg-dark text-white text-center'>
				<Card.Img
					src='https://images.unsplash.com/photo-1569285647999-67fc5a1ff1ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
					alt='Card image'
				/>
				<Card.ImgOverlay>
					<Card.Body>
						<Card.Title>
							<h1 class='display-1'>OUR MISSON</h1>
						</Card.Title>
						<Card.Text>
							To provide people a better way of supporting local and national
							political figures
						</Card.Text>
					</Card.Body>
				</Card.ImgOverlay>
			</Card>
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
