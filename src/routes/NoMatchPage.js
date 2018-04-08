import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
// import browserHistory from 'history/createBrowserHistory';

const { Header, Sider, Content, Footer } = Layout;
export default class NoMatchPage extends React.Component {
  state={
    username:null,
  }
  componentDidMount() {
    // this.runPolling();
    //用于获取session中用户信息，若存在则获取到用户名称

    fetch('http://www.myflood.com/getCurrentUser', {
      method: 'POST',
      credentials: 'include',
      headers:
        {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      },
    ).then((data) => {
      if (data.flag) {
        //当前是否登录
        this.setState({
          username:data.object,
        });
      }
    }).catch((error) => {
      alert(error.toString());
    });


  }
  render() {
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
            {/* <Menu.Item key="6"><Link to={path}>首页</Link></Menu.Item>*/}
            <Menu.Item key="0"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="1"><Link to="/access">传感器观测接入</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/subscribe">洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/evaluate">洪涝事件管理</Link></Menu.Item>
            <Menu.Item key="4" style={{ float: 'right' }}>{this.state.username==null?<Link to="/login">登录</Link>:`尊敬的${this.state.username}，您好！`}</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 1000, textAlign: 'center' }}>
            {this.props.location.query == null ? <h1>404 NOT Found</h1> : <h1>{this.props.location.query}</h1>}
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>
          武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
        </Footer>
      </Layout>
    );
  }
}
