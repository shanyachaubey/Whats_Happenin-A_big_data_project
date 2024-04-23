import React from 'react';
import { Navbar, Nav, Container, NavItem } from 'react-bootstrap';
import 'jquery-ui/ui/widgets/datepicker'; 
import logo from '../../utils/images/whatshappeninLogo.jpeg';
import './navBar.css';  // Make sure your CSS is properly linked and set up
import github from '../../utils/images/gitLogo3.jpeg';
function Navigation() {
  return (
    <>
      <Navbar className='navbar' bg="black" expand="lg" variant="dark"> {/* variant="dark" ensures light text color on dark bg */}
        <Container fluid>
          <Navbar.Brand>
            <Nav.Link href="/" style={{ padding: 0 }}> {/* Ensure there's no padding around the logo */}
              <img src={logo} alt="What's Happenin Logo" style={{ height: '100%', maxHeight: '50px' }} />
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto"> {/* ms-auto pushes content to the right */}
              <NavItem>
              <Nav.Link href="https://github.com/shanyachaubey/Whats_Happenin-A_big_data_project.git" style={{ padding: 0 }}> {/* Ensure there's no padding around the logo */}
              <img src={github} alt="git" style={{ height: '40px' }} />
            </Nav.Link>
              </NavItem>
              
              <Nav.Item>
                <Nav.Link href="/MVP" className="nav-link">Explore</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/About_US" className="nav-link">About Us</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;