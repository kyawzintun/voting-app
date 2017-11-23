import React, { Component } from 'react';
import NavBar from '../navbar/nav';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import store from 'store';
import './login.css';
import 'bootstrap/dist/css/bootstrap.css'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: null
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    const { history } = this.props;
    this.setState({ error: false });

    if(!(username === 'kyawzintun' && password === 'test')) {
      return this.setState({ error: true });
    }

    store.set('loggedIn', true);
    store.set('user', username);
    history.push('/');
  }

  handleChange(e) {
    if(e.target.type === 'text') {
      this.setState({ username: e.target.value });
    }else {
      this.setState({ password: e.target.value });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <NavBar />
        <main>
          <h1>Login</h1>
          <form onSubmit={this.onSubmit}>
            {error && <p className="err-msg">
              That username/password is incorrect. Try again!
            </p>}
            <FormGroup controlId="username">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="Enter username"
                required
                />
            </FormGroup>
            <FormGroup controlId="psw">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Enter password"
                required
                />
            </FormGroup>
            <Button type="submit" bsStyle="primary">Create</Button>
          </form>
        </main>
      </div>
    );
  }
}

export default Login;