import React from 'react';
import { TabComponent } from '../components/TabComponent';

export default class SendParamPage extends React.Component {

  constructor(props) {
    super(props);
    // const data = this.props.location.query;
  }
  render() {
    return (
      <div style={{ height: '100px' }}> {this.props.location.query.name}</div>

    );
  }
}
