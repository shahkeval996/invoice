import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Layout(props) {
    const navigate = useNavigate();

  return (
    <div>
      <Navbar expand="lg" variant="dark" bg="success">
        <Container>
          <Navbar.Brand>Quotation</Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end"> */}
            <Button variant="outline-light" onClick={() => navigate("/cart")}>
              <i className="bi bi-cart"></i>
            </Button>
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
      <Container className="mt-2">{props.children}</Container>
    </div>
  );
}

export default Layout;
