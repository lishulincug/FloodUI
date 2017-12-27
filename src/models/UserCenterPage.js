import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Map } from 'react-amap';
import { Link } from 'dva/router';
// import browserHistory from 'history/createBrowserHistory';

const { Header, Sider, Content, Footer } = Layout;

export default class UserCenterPage extends React.Component {
  state = {
    collapsed: false,
  };
  handleMenuClick=(e) => {
    const key = e.key;
    switch (key) {
      case '1':break;
      case '2':
        break;
      case '3':break;
      default:break;
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const path = {
      pathname: '/send',
      query: { name: 'sam' },
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
            <Menu.Item key="1"><Link to={path}>传感器观测接入</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/sensor">洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3">洪涝灾害评估</Menu.Item>
            <Menu.Item key="4" style={{ float: 'right' }}>登录</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 410 }}>
            <div style={{ width: '100%', height: '100%' }}>
              <Map amapkey={'788e08def03f95c670944fe2c78fa76f'} />
            </div>
          </Content>
          <Icon
            className="trigger"
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          <Sider
            trigger={null}
            collapsible
            width={200}
            collapsed={this.state.collapsed}
            style={{ backgroundColor: 'white' }}
          >
            <div className="logo" />
            <Menu theme="primary-color" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="user" />
                <span>汉江流域洪涝事件</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="video-camera" />
                <span>黄河流域洪涝事件</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span>其他洪涝事件</span>
              </Menu.Item>
            </Menu>
          </Sider>
        </Layout>
        <Footer style={{ textAlign: 'center'}}>
          武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
        </Footer>
      </Layout>
    );
  }
}
