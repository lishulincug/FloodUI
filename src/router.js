import React from 'react';
import {Router, Route, Switch} from 'dva/router';
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

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={UserCenterPage}/>
        <Route exact path="/user" component={UserCenterPage}/>
        <Route exact path="/access" component={SensorAccessPage}/>
        <Route exact path="/send" component={SendParamPage}/>
        <Route exact path="/subscribe" component={EventSubScribeMangerPage}/>
        <Route exact path="/show" component={EventShowPage}/>
        <Route exact path="/evaluate" component={EvaluateDisasterPage}/>
        <Route exact path="/tab" component={TabsPage}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/sensor" component={SelectSensorPage}/>
        <Route exact path="/*" component={NoMatchPage}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
