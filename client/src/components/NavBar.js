import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

// Redux
import { connect } from 'react-redux';
import { logout } from '../redux/actions/authAction';

// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const NavBar = ({ auth: { isAuthenticated, loading }, logout }) => {
	const authLinks = (
		<Fragment>
			<LinkContainer to='/dash'>
				<Navbar.Brand>
					<h2>UPIRIA</h2>
				</Navbar.Brand>
			</LinkContainer>
			<Nav className='mr-auto'>
				<LinkContainer to='/dash'>
					<Nav.Link>Dash</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/search'>
					<Nav.Link>Search</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/settings'>
					<Nav.Link>Settings</Nav.Link>
				</LinkContainer>
				<Button variant='danger' onClick={logout}>
					Log Out
				</Button>
			</Nav>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<LinkContainer to='/'>
				<Navbar.Brand>
					<h2>UPIRIA</h2>
				</Navbar.Brand>
			</LinkContainer>
			<Nav className='mr-auto'>
				<LinkContainer to='/login'>
					<Nav.Link>Login</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/register'>
					<Nav.Link>Register</Nav.Link>
				</LinkContainer>
			</Nav>
		</Fragment>
	);

	return (
		<Navbar bg='primary' variant='dark'>
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
