import React, { Component } from 'react';
import store from 'store';
import axios from 'axios';
import NavBar from '../navbar/nav';
import Footer from '../footer/footer';
import { Jumbotron, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './polls.css';

const baseUrl = process.env.REACT_APP_API_URL;
const tweetUrl = "https://twitter.com/intent/tweet?text=";
const colors = ["#00eeee", "#ee0000", "#b8d6ad", "#4c0f25", "#000080", "#672f1b", "#ff5252", "#ffc0cb", "#4d4d4d", "#570095", "#001a75", "#0b3f00", "#b5aa00", "#c07400", "#610000", "#5e503c", "#1d80a5", "#bada55", "#acacd9", "#77dd7e", "#ff5f00", "#f87054", "#fc5d3d", "#ff5252", "#fff100", "#976360", "#d18884", "#ca7671", "#788c64", "#555a4c", "#aab498", "#b5af89", "#433622", "#a98756", "#f9ae88", "#b0d8da", "#6878cc", "#d7ecfd", "#ffc0cb", "#008080", "#9c6b77", "#4b5967", "#B71C1C", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"];
class Polls extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {},
      loading: true,
      index: null
    }

    this.parseJwt = this.parseJwt.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.votePoll = this.votePoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
  }
  notifySuccess = (msg) => toast.success(msg);
  notifyError = (msg) => toast.error(msg);
  notifyInfo = (msg) => toast.info(msg);
  componentDidMount() {
    let pollId = this.props.match.params.id;
    let _this = this;
    axios({
      method: 'get',
      url: baseUrl + 'polls/' + pollId,
    }).then((res) => {
      _this.setState({ data: res.data, loading: false });
    }, (err) => {
      this.props.history.push('/');
    })
  }

  parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
  };

  handleChange(e) {
    this.setState({ index: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.state.index !== null) {
      let index = parseInt(this.state.index);
      let options = this.state.data.options;
      let name = options[index].name;
      let value = options[index].value;
      options[index] = { name: name, value: value + 1 }
      this.setState({ options })
      this.votePoll(this.state.data, name);
    }
  }

  votePoll(data, pollName) {
    let _this = this;
    axios({
      method: 'put',
      url: baseUrl + 'vote/' + data._id,
      data: data
    }).then(function (res) {
      _this.notifySuccess(`You voted ${pollName}`);
      _this.componentDidMount();
    })
    .catch((err) => {
      _this.componentDidMount();
      if(err.response.status === 422) {
        _this.notifyInfo(err.response.data);
      }else {
        _this.notifyError(err.response.data);
      }
    });
  }

  deletePoll() {
    let pollId = this.props.match.params.id
    axios({
      method: 'delete',
      url: baseUrl + 'delete-poll/' + pollId,
      headers: { 'token': store.get('loggedIn') },
    }).then((res) =>{
      this.notifySuccess('Successfully deleted.');
      let _this = this;
      setTimeout(() => {
        _this.props.history.push('/')
      }, 1000);
    }).catch(err => {
      this.notifyError(err.data.response);
    })
  }

  render() {
    let content;
    let userId = store.get('loggedIn') ? this.parseJwt(store.get('loggedIn')).id : null;
    if (!this.state.loading) {
      let tweetMsg = this.state.data.title + ' %7C Voting-App https://kyawzintun.github.io/polls/' + this.state.data._id;
      let tweet = tweetUrl+tweetMsg;
      let isCreatedUser = userId === this.state.data.userId ? true : false;
      content = <div className="row">
                  <div className="col-sm-4">
                    <p>{this.state.data.title}</p>
                    <form onSubmit={this.onSubmit}>
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>I'd like to vote for...:</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select" onChange={this.handleChange}>
                          <option value='null' >Select</option>
                          {
                            this.state.data.options.map((option, index) => {
                            return ( <option value={index} key={index}>{option.name}</option> );
                            })
                          }
                        </FormControl>
                      </FormGroup>
                      <Button type="submit" bsStyle="primary" className="vote-btn" block>Vote</Button>
                      <a href={tweet} target="_blank" className="tweet-btn-link">
                        <button type="button" className="twitter-btn btn btn-primary btn-block"> Share on Twitter</button>
                      </a>
                    </form>
                  </div>
                  <div className="col-sm-8">
                    <PieChart width={800} height={400}>
                      <Pie data={this.state.data.options} cx={330} cy={190} innerRadius={100} outerRadius={180} fill="#82ca9d">
                        {
                          this.state.data.options.map((poll, index) => {
                            const stroke = this.state.selectedIndex === index ? 'red' : undefined;
                            return <Cell key={index}
                              fill={colors[index]}
                              stroke={stroke} />
                          })
                        }
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="chart-legend">
                      <ul className="doughnut-legend">
                        {
                          this.state.data.options.map((poll, index) => {
                            return <li key={index}><span style={{backgroundColor: colors[index] }}></span>{poll.name}</li>
                          })
                        }
                      </ul>
                    </div>
                    { isCreatedUser && 
                      <Button bsStyle="danger" onClick={this.deletePoll} block>Remove this poll</Button>
                    }
                  </div>
                </div>
    } else {
      content = <p>Loading...</p>;
    }
    return (
      <div className='Polls'>
        <NavBar />
        <main>
          <Jumbotron className="polls-jumbotron">
            {content}
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

export default Polls;