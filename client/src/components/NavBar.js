import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavBar = () => {
	return (
		<Navbar bg='primary' variant='dark'>
			<LinkContainer to='/'>
				<Navbar.Brand>Upiria</Navbar.Brand>
			</LinkContainer>
			<Nav className='mr-auto'>
				<LinkContainer to='/login'>
					<Nav.Link>Login</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/register'>
					<Nav.Link>Register</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/dash'>
					<Nav.Link>Dash</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/search'>
					<Nav.Link>Search</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/settings'>
					<Nav.Link>Settings</Nav.Link>
				</LinkContainer>
			</Nav>
		</Navbar>
	);
};

export default NavBar;
