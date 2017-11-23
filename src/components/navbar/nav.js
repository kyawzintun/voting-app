import React, { Component } from 'react';
import PropTypes from "prop-types";
import TwitterLogin from 'react-twitter-auth';
import isLoggedIn from '../../helper/is_logged_in';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import store from 'store';
import 'bootstrap/dist/css/bootstrap.css';
import './nav.css';

const baseUrl = process.env.REACT_APP_API_URL;
const login_url = baseUrl + "api/v1/auth/twitter";
const request_token_url = baseUrl + "api/v1/auth/twitter/reverse";

class NavBar extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.handleLogout = this.handleLogout.bind(this);
  }

  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        store.set('loggedIn', token);
        store.set('user', user.dispalyname);
        this.context.router.history.push('/');
      }
    });
  };

  onFailed = (error) => {
    alert(error);
  };

  handleLogout() {
    store.remove('loggedIn');
    store.remove('user');
    this.context.router.history.push('/');
  }
  render() {
    const isloggedin = isLoggedIn();
    const loggedInUser = isloggedin ? store.get('user') : null;
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">FCC - Voting App</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="my-navbar">
          <Nav pullRight>
            <LinkContainer to="/">
              <NavItem eventKey={1}>Home</NavItem>
            </LinkContainer>
            {isloggedin && 
              <LinkContainer to="/my-polls">
                <NavItem eventKey={2}>My Polls</NavItem>
              </LinkContainer>
            }
            {isloggedin && 
              <LinkContainer to="/new-poll" >
                <NavItem eventKey={2}>New Poll</NavItem>
              </LinkContainer>
            }
            {isloggedin && 
              <NavDropdown eventKey={3} title={loggedInUser} id="basic-nav-dropdown">
                <MenuItem eventKey={3.2}>
                  <Button bsStyle="primary" onClick={this.handleLogout} block>Logout</Button>
                </MenuItem>
              </NavDropdown>
            }
            {!isloggedin && 
                <TwitterLogin loginUrl={login_url}
                  onFailure={this.onFailed} onSuccess={this.onSuccess}
                  requestTokenUrl={request_token_url} />
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;