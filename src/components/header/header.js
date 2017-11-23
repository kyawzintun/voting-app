import React, { Component } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { Button, Jumbotron } from 'react-bootstrap';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
import store from 'store';
import 'bootstrap/dist/css/bootstrap.css'

import NavBar from '../navbar/nav';

class Header extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  render() {
    let isHomeRoute = this.props.match.path === '/' ? true : false;
    let isLoggedInUser = store.get('loggedIn');
    return (
      <header>
        <NavBar />
        <Jumbotron className="my-jumbotron">
          <h1>Voting App</h1>
          { isHomeRoute && 
            <p className="head-msg">Below are polls hosted by others.</p>
          }
          { !isHomeRoute && 
            <p className="head-msg">Below are polls you own.</p>
          }
          <p className="head-msg head-msg-2">Select a poll to see the results and vote.</p>
          { isLoggedInUser &&
            <p>
              <Button bsStyle="success" bsSize="large" ><Link to='/new-poll'>New Poll</Link></Button>
              <Button bsStyle="primary" bsSize="large" ><Link to='/my-polls'>My Polls</Link></Button>
            </p> 
          }
          { !isLoggedInUser &&
            <p>Please Sign in with Twitter to create new poll.</p>
          }
        </Jumbotron>
      </header>
    );
  }
}

export default withRouter(Header);