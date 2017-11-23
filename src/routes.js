import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/home/home';
import Polls from './components/polls/polls';
import NewPoll from './components/new-poll/new-poll';
import MyPolls from './components/my-polls/my-polls';
import NotFound from './components/not-found/not-found';

const Routes = (props) => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/polls/:id' component={Polls} />
      <Route exact path='/new-poll' component={NewPoll} />
      <Route exact path='/my-polls' component={MyPolls} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;