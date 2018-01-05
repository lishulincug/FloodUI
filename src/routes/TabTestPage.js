import React from 'react';
import { ChartComponent } from '../components/ChartComponent';
import {HighChartsComponent} from "../components/HighChartsComponent";

export default class TabTestPage extends React.Component {
  callback=(key) => {
    console.log(key);
  }
  render() {
    return (<HighChartsComponent/>);
  }
}
