import React from 'react';
import {Layout, Menu, Icon, Button} from 'antd';
import {Map, Markers, InfoWindow} from 'react-amap';
import {Link} from 'dva/router';
import PropTypes from 'prop-types';
import fetch from 'dva/fetch';
import img from '../assets/event.png';

const {Header, Sider, Content, Footer} = Layout;
const data = ['sda', 'sda'];
export default class UserCenterPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  state = {
    sensors: null,
    collapsed: false,
    username: null,
    currentEventInfo: null,
    markers: {
      position: {
        longitude: 115,
        latitude: 30,
      },
    },
    currentMarker: null,
    visible: true,
    center: {longitude: 120.1, latitude: 30.1},
  };

  constructor(props, context) {
    super(props, context);
    const _this = this;
    // 随机生成 10 个标记点的原始数据
    this.markers = null;
    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        const index = extData.myIndex;
        // alert(extData.position.longitude);
        const visi = _this.state.visible;
        _this.setState({currentMarker: extData, visible: !visi});
      },
    };
    // this.renderMarkerFn = extData => (
    //   <div>{extData.myIndex}</div>
    // );
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
          username: data.object,
        });
      }
    }).catch((error) => {
      alert(error.toString());
    });

    fetch('http://www.myflood.com/getAllEventParams', {
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
        //构建Sensors
        var sensors = new Array();
        var events = data.object;
        for (var i = 0; i < events.length; i++) {
          var oneSensor = {};
          oneSensor.lon = events[i].maxLon;
          oneSensor.lat = events[i].maxLat;
          oneSensor.eventID = events[i].eventID;
          oneSensor.name = events[i].userDefineName;
          sensors.push(oneSensor);
        }
        this.setState({
          currentEventInfo: data.object,
          sensors: sensors,
        });
      } else {
        const path = {
          pathname: '/error',
          query: data.message,
        };
        this.context.router.history.push(path);
      }
    }).catch((error) => {
      alert(error.toString());
    });
  }

  handleMenuClick = (e) => {
    const key = e.key;
    switch (key) {
      case '1':
        break;
      case '2':
        break;
      case '3':
        break;
      default:
        break;
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  renderMarkerLayout(extData) {
    return  <img src={img}></img>
  }

  createEventMenu = () => {
    var events=this.state.currentEventInfo;
    if (events==null) return(<div>系统中未包含任何洪涝订阅事件</div>)
    for(var i=0;i<events.length;i++) {
      events[i].key=i;
    }
    return (<Menu theme="primary-color" mode="inline" defaultSelectedKeys={['1']} onClick={(item1,key)=>{
      console.log(this.state.sensors);

      console.log(this.state.sensors[parseInt(item1.key)].lon);
      this.setState({
        center:{
          longitude: this.state.sensors[parseInt(item1.key)].lon, latitude:this.state.sensors[parseInt(item1.key)].lat
        }
      })}}>
      { events.map((item)=>{
      return(<Menu.Item key={item.key}><Icon type="schedule" /><span>{item.userDefineName}</span></Menu.Item>)
    })}
    </Menu>);
  }

  render() {
    // const path = {
    //   pathname: '/send',
    //   query: { name: 'sam' },
    // };
    return (
      <Layout>
        <Header style={{height: '34px'}}>
          {/* <Icon*/}
          {/* className="trigger"*/}
          {/* type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}*/}
          {/* onClick={this.toggle}*/}
          {/* />*/}
          <div className="logo"/>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[]}
            style={{lineHeight: '34px'}}
            onClick={this.handleMenuClick}
          >
            {/* <Menu.Item key="5"><a onClick={this.sendData}>首页1</a></Menu.Item>*/}
            <Menu.Item key="0"><Link to="/">首页</Link></Menu.Item>
            <Menu.Item key="1"><Link to="/access">传感器观测接入</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/subscribe">洪涝事件订阅</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/manage">洪涝事件管理</Link></Menu.Item>
            <Menu.Item key="4" style={{float: 'right'}}>{this.state.username == null ?
              <Link to="/login">登录</Link> : `尊敬的${this.state.username}，您好！`}</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{margin: '12px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 1000}}>
            <div style={{width: '100%', height: '100%'}}>
              <Map amapkey={'788e08def03f95c670944fe2c78fa76f'} plugins={['ToolBar']} center={this.state.center}>
                <Markers
                  // render={this.renderMarkerFn}
                  markers={this.state.sensors != null ? this.state.sensors.map((e, i) => {
                    const position = { longitude: e.lon, latitude: e.lat };
                    return {
                      position,
                      // 这个属性就可以用来确定点击的是哪个坐标点
                      myIndex: i,
                    };
                  }) : this.markers}
                  events={this.markersEvents}
                  useCluster
                  render={this.renderMarkerLayout}
                />
                {this.state.currentMarker != null ?
                  <InfoWindow
                    position={this.state.currentMarker == null ? this.state.markers.position : this.state.currentMarker.position}
                    visible={this.state.visible}
                    isCustom={false}
                    showShadow
                    content={`<div><table border="1"><tbody><tr><td><h3 style="color: orangered;">传感器编号：</h3> </td> <td style="width: 100px">${this.state.sensors[this.state.currentMarker.myIndex].eventID}</td>
</tr> <tr><td><h3 style="color: orangered;">传感器名称</h3></td> <td style="width: 100px">${this.state.sensors[this.state.currentMarker.myIndex].name} </td> </tr> </tbody>
</table></div>`}
                    // size={{
                    //   width: 200,
                    //   height: 140,
                    // }}
                    offset={[0, 0]}
                  /> : <div />}

              </Map>
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
            style={{backgroundColor: 'white'}}
          >
            <div className="logo"/>
            {this.createEventMenu()}
          </Sider>
        </Layout>
        <Footer style={{textAlign: 'center'}}>
          武汉大学陈能成团队SensorWeb小组 ©2017 Created by Yuan Sai
        </Footer>
      </Layout>
    );
  }
}
