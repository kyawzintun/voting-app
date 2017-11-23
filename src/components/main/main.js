import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import axios from 'axios';
import store from 'store';
import { Jumbotron } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.css'

const baseUrl = process.env.REACT_APP_API_URL;

class Main extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  constructor() {
    super();
    this.state = {
      data: {},
      loading: true,
    }
  }
  componentDidMount() {
    console.log(this.props);
    let _this = this;
    let apiRoute = this.props.match.path === "/my-polls" ? "my-polls" : "get-polls";
    if(apiRoute === 'my-polls'){
      axios({
        method: 'get',
        headers: { 'token': store.get('loggedIn') },
        url: baseUrl + apiRoute
      }).then(function (res) {
        console.log(res, "my-polls");
        _this.setState({ data: res.data, loading: false });
      }).catch(err => {
        console.log(err.response);
        toast.error('Something Went Wrong!!!');
      });
    }else {
      axios({
        method: 'get',
        url: baseUrl + apiRoute
      }).then(function (res) {
        console.log(res, "my-polls");
        _this.setState({ data: res.data, loading: false });
      }).catch(err => {
        console.log(err.response);
        toast.error('Something Went Wrong!!!');
      });
    }
  }

  render() {
    let content;
    if (!this.state.loading) {
      if (this.state.data.length) {
        content = this.state.data.map((vote, index) =>
          <li className="list-group-item" key={index}>
            <Link to={{
              pathname: '/polls/' + vote._id,
            }}>{vote.title}</Link>
          </li>
        );
      }else {
        content = <p>There is no poll. Please create poll.</p>
      }
    } else {
      content = <p>Loading...</p>;
    }
    return (
      <main>
        <Jumbotron>
          <ul className="list-group">
            {content}
          </ul>
        </Jumbotron>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          />
      </main>
    );
  }
}

export default withRouter(Main);