import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';

// Redux
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authAction';

// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const LogoNavBar = styled(Navbar.Brand)`
	font-family: 'Montserrat', sans-serif;
`;

const NavBar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
	const authLinks = (
		<Fragment>
			<LinkContainer to='/dash'>
				<LogoNavBar>
					<h2>UPIRIA</h2>
				</LogoNavBar>
			</LinkContainer>
			<Nav className='ml-auto'>
				<LinkContainer to='/dash' className='mx-2'>
					<Nav.Link>Dash</Nav.Link>
				</LinkContainer>

				{user && !user.selectedReceiverId && (
					<LinkContainer to='/search' className='mx-2'>
						<Nav.Link>Search</Nav.Link>
					</LinkContainer>
				)}

				{user && user.isReceiver && (
					<LinkContainer to='/receiver' className='mx-2'>
						<Nav.Link>Receiver</Nav.Link>
					</LinkContainer>
				)}

				<LinkContainer to='/settings' className='mx-2'>
					<Nav.Link>Settings</Nav.Link>
				</LinkContainer>
				<Button
					variant='danger'
					onClick={logout}
					className='mx-2'
					disabled={loading}
				>
					{loading ? <Spinner animation='border' /> : 'Log Out'}
				</Button>
			</Nav>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<LinkContainer to='/'>
				<LogoNavBar>
					<h2>UPIRIA</h2>
				</LogoNavBar>
			</LinkContainer>
			<Nav className='ml-auto'>
				<LinkContainer to='/login' className='mx-2'>
					<Nav.Link>Login</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/register' className='mx-2'>
					<Nav.Link>Register</Nav.Link>
				</LinkContainer>
			</Nav>
		</Fragment>
	);

	return (
		<Navbar bg='primary' variant='dark' sticky='top'>
			{!loading && (
				<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
			)}
		</Navbar>
	);
};

NavBar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

const mapActionsToProps = {
	logout
};

export default connect(mapStateToProps, mapActionsToProps)(NavBar);
