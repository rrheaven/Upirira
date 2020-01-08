import React from 'react';

// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavBar = () => {
	return (
		<Navbar bg='primary' variant='dark'>
			<Navbar.Brand href='#home'>Upiria</Navbar.Brand>
			<Nav className='mr-auto'>
				<Nav.Link href='#login'>Login</Nav.Link>
				<Nav.Link href='#register'>Register</Nav.Link>
				<Nav.Link href='#dash'>Dash</Nav.Link>
				<Nav.Link href='#search'>Search</Nav.Link>
				<Nav.Link href='#settings'>Settings</Nav.Link>
			</Nav>
		</Navbar>
	);
};

export default NavBar;
