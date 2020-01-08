import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const NavBar = () => {
	return (
		<Navbar bg='primary' variant='dark'>
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
				<LinkContainer to='/dash'>
					<Nav.Link>Dash</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/search'>
					<Nav.Link>Search</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/settings'>
					<Nav.Link>Settings</Nav.Link>
				</LinkContainer>
				<Button variant='danger'>Log Out</Button>
			</Nav>
		</Navbar>
	);
};

export default NavBar;
