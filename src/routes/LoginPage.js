import React from 'react';
import { Layout, Menu, Col, Row } from 'antd';
import { Link } from 'dva/router';
import { LoginComponet } from '../components/LoginComponent';

const { Header, Sider, Content, Footer } = Layout;
export default class LoginPage extends React.Component {
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
          {/* <Icon*/}
          {/* className="trigger"*/}
          {/* type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}*/}
          {/* onClick={this.toggle}*/}
          {/* />*/}
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
            {/* {alert(this.props.location.query.dataset.flag)}*/}
            <br/>
            <br/>
            <br/>
            <Row>
              <Col span={8} />
              <Col span={8}><LoginComponet /></Col>
              <Col span={8} />
            </Row>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
          </Footer>
        </Layout>
      </Layout>
    );
  }
 }
