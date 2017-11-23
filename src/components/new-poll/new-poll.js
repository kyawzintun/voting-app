import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../../helper/is_logged_in';
import NavBar from '../navbar/nav';
import Footer from '../footer/footer';
import store from 'store';
import axios from 'axios';
import { Jumbotron, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './new-poll.css';

const baseUrl = process.env.REACT_APP_API_URL;

class NewPoll extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      options: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  notifySuccess = (msg) => toast.success(msg);
  notifyError = (msg) => toast.error(msg);

  handleChange(e) {
    if(e.target.type === 'text') {
      this.setState({ title: e.target.value });
    }else {
      this.setState({ options: e.target.value });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let options = this.state.options.replace(/\n/g, ",").split(',');
    let reformat = [];
    options.forEach(opt => {
      reformat.push({ name: opt, value: 0 });
    });
    let voteObj = {
      "title": this.state.title,
      "options": reformat,
    };
    let _this = this;
    axios({
      method: 'post',
      headers: { 'token': store.get('loggedIn') },
      url: baseUrl + 'create-poll',
      data: voteObj
    }).then(function (res) {
      console.log('create success ', res);
      _this.setState({ title: '' ,options: '' });
      _this.notifySuccess('Successfully created new poll');
    }).catch(err => {
      _this.setState({ title: '', options: '' });
      _this.notifyError('Error to create new poll.');
    })
  }

  render() {
    if (!isLoggedIn()) {
      return (<Redirect to="/" />);
    }
    return (
      < div className='App' >
        <NavBar />
        <main>
          <Jumbotron className="new-poll-jumbotron">
            <h1>Make a new poll!</h1>
            <form onSubmit={this.onSubmit}>
              <FieldGroup
                id="formControlsText"
                type="text"
                label="Title:"
                name="title"
                value={this.state.title}
                placeholder="Enter poll title"
                required
                onChange={this.handleChange}
                />
              <FormGroup controlId="formControlsTextarea">
                <ControlLabel>Options (seperated by line):</ControlLabel>
                <FormControl 
                  name="options" 
                  value={this.state.options}
                  componentClass="textarea" 
                  placeholder="Enter options" 
                  rows="4"
                  onChange={this.handleChange}
                  required />
              </FormGroup>
              <Button type="submit" bsStyle="primary">Create</Button>
            </form>
          </Jumbotron>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          />
      </div>
    );
  }
}

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

export default NewPoll;