import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './styles.css'
import 'jquery-ui/ui/widgets/datepicker'; 

function Navigation() {
  return (
    <>
      <Navbar expand="lg" bg="light">
        <Container>
          <Navbar.Brand>
            <img src="/../../utils/images/wh_logo.png" alt="" style={{ height: '100%', maxHeight: '50px' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="justify-content-center">
              <Nav.Item>
                <Nav.Link href = "/">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href = "/About_US">About Us</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/Contact_US">Contact Us</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
