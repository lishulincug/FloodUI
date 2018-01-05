import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import UserCenterPage from './routes/UserCenterPage';
import NoMatchPage from './routes/NoMatchPage';
import SendParamPage from './routes/SendParamPage';
import EventSubScribeMangerPage from './routes/EventSubscribeMangerPage';
import SensorAccessPage from './routes/SensorAccessPage';
import EventShowPage from './routes/EventShowPage';
import EvaluateDisasterPage from './routes/EvaluateDisasterPage';
import TabsPage from './routes/TabTestPage';
import LoginPage from './routes/LoginPage';
import SelectSensorPage from './routes/SelectSensorPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <div>
      <Switch>
        <Route path="/" exact component={UserCenterPage} />
        <Route path="/user" exact component={UserCenterPage} />
        <Route path="/access" exact component={SensorAccessPage} />
        <Route path="/send" exact component={SendParamPage} />
        <Route path="/subscribe" exact component={EventSubScribeMangerPage} />
        <Route path="/show/:eventID" exact component={EventShowPage} />
        <Route path="/evaluate" exact component={EvaluateDisasterPage} />
        <Route path="/tab" exact component={TabsPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/sensor" exact component={SelectSensorPage} />
        <Route path="/*" exact component={NoMatchPage} />
      </Switch>
      </div>
    </Router>
  );
}

export default RouterConfig;
