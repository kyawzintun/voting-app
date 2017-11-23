import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {  
  render() {
    return (
      <footer className="footer">
        <p>
          This "fcc-voting" app is built by 
          <a href="http://freecodecamp.com/cukyawzintun"> @cukyawzintun </a>
          of freecodecamp
        </p>
        <p>
          following the instructions of 
          <a href="https://www.freecodecamp.org/challenges/build-a-voting-app"> "Basejump: Build a Voting App | Free Code Camp" </a>.
        </p>
        <p>
          Github Repository: <a href="https://github.com/kyawzintun/voting-app">kyawzintun/voting-app</a>
        </p>
      </footer>
    );
  }
}

export default Footer;