import React from 'react';
import { Layout, Menu, Button, Table } from 'antd';
import { Link } from 'dva/router';
// import browserHistory from 'history/createBrowserHistory';

const { Header, Sider, Content, Footer } = Layout;
const { Column } = Table;
const data = [{
  key: '1',
  sensorID: 'urn:liesmars:insitusensor:platform:BaoxieWeatherSoilStation1',
  sensorName: '豹澥气象土壤监测站1',
  status: 'active',
}, {
  key: '2',
  sensorID: 'urn:liesmars:insitusensor:platform:BaoxieWeatherSoilStation2',
  sensorName: '豹澥气象土壤监测站2',
  status: 'active',
}, {
  key: '3',
  sensorID: 'urn:liesmars:insitusensor:platform:BaoxieHydrologicalStation',
  sensorName: '豹澥水文监测站',
  status: 'active',
}];
export default class UserCenterPage extends React.Component {
  state = {
    collapsed: false,
    username: null,
  };

  componentDidMount() {
    // this.runPolling();
    // 用于获取session中用户信息，若存在则获取到用户名称

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
        // 当前是否登录
        this.setState({
          username: data.object,
        });
      }
    }).catch((error) => {
      alert(error.toString());
    });
  }
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
  operator=(text, record, index) => {
    return <Button type={'primary'}>激活</Button>;
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
            <Menu.Item key="2"><Link to={path}>洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/manage">洪涝事件管理</Link></Menu.Item>
            <Menu.Item key="4" style={{ float: 'right' }}>{this.state.username == null ? <Link to="/login">登录</Link> : `尊敬的${this.state.username}，您好！`}</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 1000 }}>
            {/* 此处存放现在已经接入的传感器设置，管理传感器数据的接入*/}
            <br />
            请选择上传的传感器拓扑：<Button type={'primary'}>上传传感器接入拓扑</Button>
            <br />
            <br />
            <hr />
            <br />
            <Table dataSource={data}>
              <Column
                title="编号"
                dataIndex="key"
                key="key"
              />
              <Column
                title="传感器ID"
                dataIndex="sensorID"
                key="sensorID"
              />
              <Column
                title="传感器名称"
                dataIndex="sensorName"
                key="sensorName"
              />
              <Column
                title="状态"
                dataIndex="status"
                key="status"
              />
              <Column title="操作" render={this.operator} />
            </Table>
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>
          武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
        </Footer>
      </Layout>
    );
  }
}
