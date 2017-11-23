import React, { Component } from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import Main from '../main/main';
import './home.css';
import 'bootstrap/dist/css/bootstrap.css'

class Home extends Component {
  render() {
    return (
      <div className='App' >
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default Home;