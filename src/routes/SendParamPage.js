import React from 'react';
import {TabComponent} from '../components/TabComponent';
import bpimg from '../assets/BP.png';

export default class SendParamPage extends React.Component {

  constructor(props) {
    super(props);
    // const data = this.props.location.query;
  }

  render() {
    return (
      <img src={bpimg}/>

    );
  }
}
