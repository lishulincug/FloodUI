import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
import { EventShowComponent } from '../components/EventShowComponent';


const { Header, Content, Footer } = Layout;

export default class EventSubscribeMangerPage extends React.Component {
  state={
    random: 12,
  }
  constructor(props) {
    super(props);
  // alert(this.props.match.params.eventID);
  }
  componentDidMount() {
    // this.runPolling();
  }
  *pollForWeatherInfo() {
    while (true) {
      yield fetch('http://www.myflood.com/rand', {
        method: 'get',
      }).then((d) => {
        const json = d.json();
        return json;
      });
    }
  }
  runPolling=(generator) => {
    if (!generator) {
      generator = this.pollForWeatherInfo();
    }

    const p = generator.next();
    p.value.then((d) => {
      if (d) {
        document.querySelector('#num').innerText = d;
        this.runPolling(generator);
      } else {
        console.log(d);
      }
    });
  }

  render() {
    const path = {
      pathname: '/subscribe',
      query: { dataset: { flag: false,
        sensorList: [{ sensorID: 'sensor1', propertyID: 'property1' },
          { sensorID: 'sensor1', propertyID: 'property1' }] },
        event: { flag: false, eventID: 'event1', params: [0, 1, 2, 3] },
        email: { flag: false, address: 'yuansaii@qq.com' } },
    };
    return (
      <Layout>
        <Header style={{ height: '34px' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[]}
            style={{ lineHeight: '34px' }}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="0"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="1"><Link to="/access">传感器观测接入</Link></Menu.Item>
            <Menu.Item key="2"><Link to={path}>洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/evaluate">洪涝灾害评估</Link></Menu.Item>
            <Menu.Item key="4" style={{ float: 'right' }}>登录</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 410 }}>
            <div id="num" />
            <EventShowComponent eventID={this.props.match.params.eventID} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

