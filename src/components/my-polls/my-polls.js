import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../../helper/is_logged_in';
import Header from '../header/header';
import Footer from '../footer/footer';
import Main from '../main/main';
import './my-polls.css';

class MyPolls extends Component {
  render() {
    if (!isLoggedIn()) {
      return (<Redirect to="/" />);
    }
    return (
      <div className='My-Poll' >
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default MyPolls;