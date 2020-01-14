import React, { Fragment } from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Media';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>Available Recipients: </Card.Title>
					<Card>
						<Card.Body>
							<Container>
								<Row>
									<Col sm={2}>
										<Image
											src={
												'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQwODQ0Nzc0MjIyNDczMDA2/joe-biden-official-portrait_1600jpg.jpg'
											}
											roundedCircle
										/>
									</Col>
									<Col sm={9}>
										<Row>
											<Card.Title>Andrew Yang</Card.Title>
										</Row>
										<Row>
											<Card.Text>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
												sed do eiusmod tempor incididunt ut labore et dolore
												magna aliqua. Ut enim ad minim veniam, quis nostrud
												exercitation ullamco laboris nisi ut aliquip ex ea
												commodo consequat.
											</Card.Text>
										</Row>
									</Col>
									<Col sm={1}>
										<Button variant='link'>
											<FontAwesomeIcon icon={faPlusSquare} size='4x' />
										</Button>
									</Col>
								</Row>
							</Container>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<Container>
								<Row>
									<Col sm={2}>
										<Image
											src={
												'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQwODQ0Nzc0MjIyNDczMDA2/joe-biden-official-portrait_1600jpg.jpg'
											}
											roundedCircle
										/>
									</Col>
									<Col sm={9}>
										<Row>
											<Card.Title>Pete Buttigieg</Card.Title>
										</Row>
										<Row>
											<Card.Text>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
												sed do eiusmod tempor incididunt ut labore et dolore
												magna aliqua. Ut enim ad minim veniam, quis nostrud
												exercitation ullamco laboris nisi ut aliquip ex ea
												commodo consequat.
											</Card.Text>
										</Row>
									</Col>
									<Col sm={1}>
										<Button variant='link'>
											<FontAwesomeIcon icon={faPlusSquare} size='4x' />
										</Button>
									</Col>
								</Row>
							</Container>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<Container>
								<Row>
									<Col sm={2}>
										<Image
											src={
												'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQwODQ0Nzc0MjIyNDczMDA2/joe-biden-official-portrait_1600jpg.jpg'
											}
											roundedCircle
										/>
									</Col>
									<Col sm={9}>
										<Row>
											<Card.Title>Joe Biden</Card.Title>
										</Row>
										<Row>
											<Card.Text>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
												sed do eiusmod tempor incididunt ut labore et dolore
												magna aliqua. Ut enim ad minim veniam, quis nostrud
												exercitation ullamco laboris nisi ut aliquip ex ea
												commodo consequat.
											</Card.Text>
										</Row>
									</Col>
									<Col sm={1}>
										<Button variant='link'>
											<FontAwesomeIcon icon={faPlusSquare} size='4x' />
										</Button>
									</Col>
								</Row>
							</Container>
						</Card.Body>
					</Card>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

export default Search;
