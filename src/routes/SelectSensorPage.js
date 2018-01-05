import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
import { EventShowComponent } from '../components/EventShowComponent';
import { SelectSensorComponent } from '../components/SelectSensorComponent';

const { Header, Content, Footer } = Layout;
export default class SelectSensorPage extends React.Component {

  render() {
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
            <Menu.Item key="2"><Link to={'/subscribe'}>洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/evaluate">洪涝灾害评估</Link></Menu.Item>
            <Menu.Item key="4" style={{ float: 'right' }}>登录</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 410 }}>
            <SelectSensorComponent />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

