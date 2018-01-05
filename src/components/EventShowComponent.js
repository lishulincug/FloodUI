import React from 'react';
import { Row, Col, Icon, Layout, Button, Tabs, Table } from 'antd';
import { Map } from 'react-amap';
import fetch from 'dva/fetch';
import browserHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware, routerReducer, push } from 'react-router-redux';
import PropTypes from 'prop-types';
import NotFoundPage from '../routes/NoMatchPage';
// import { routerRedux } from 'dva/router';

// function reducers(state = 1, action) {
//   switch (action.type) {
//     case 'Done':
//       return state + action.payload;
//     default:
//       return state;
//   }
// };

const history = browserHistory();
const routeMiddleware = routerMiddleware(history);
const store = createStore(
  routerReducer,
  applyMiddleware(routeMiddleware),
);

const { Sider, Content } = Layout;
const { Column } = Table;
const TabPane = Tabs.TabPane;
const ReactHighcharts = require('react-highcharts');
const Highcharts = require('highcharts');

const data = [{
  key: '1',
  firstName: 'John',
  lastName: 'Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  firstName: 'Jim',
  lastName: 'Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  firstName: 'Joe',
  lastName: 'Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];
const chartconfig = {
  chart: {
    zoomType: 'x',
  },
  title: {
    text: '洪涝事件探测结果阶段划分图',
  },
  subtitle: {
    text: '异常事件',
  },
  xAxis: {
    type: 'datetime',
    labels: {
      format: '{value:%y-%m-%d %H:%M}',
      align: 'right',
      rotation: -30,
    },
  },
  series: null,
};
export class EventShowComponent extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    // alert(this.props.eventID);
    // 根据eventID获取事件的名称，事件的传感器信息，事件的基本参数信息
    // 获取当前页面的基本信息
    // alert(this.props.eventID);
    this.setState({
      eventID: this.props.eventID,
      floodResult: null,
    });
  }

  componentDidMount() {
    // 获取传感器的基本信息
    fetch('http://www.myflood.com/getEventBaseData', {
      method: 'POST',
      credentials: 'include',
      headers:
      {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(this.props.eventID),
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
      const path = {
        pathname: '/error',
        query: data.message,
      };
      alert(data.flag);
      // data.flag ? this.setState({
      //   floodResult: data,
      // }) :
      this.context.router.history.push(path);
    }).catch((error) => {
      alert(error.toString());
    });

    // 获取当前流
    // this.runPolling();
  }

  // *pollForWeatherInfo() {
  //   while (true) {
  //     yield fetch('http://www.myflood.com/sadJson', {
  //       method: 'get',
  //     }).then((d) => {
  //       const json = d.json();
  //       return json;
  //     });
  //   }
  // }
  // runPolling=(generator) => {
  //   if (!generator) {
  //     generator = this.pollForWeatherInfo();
  //   }
  //
  //   const p = generator.next();
  //   p.value.then((d) => {
  //     if (d) {
  //       chartconfig.series = d;
  //       this.runPolling(generator);
  //     } else {
  //       console.log(d);
  //     }
  //   });
  // }
  showChart = () => {
    fetch('http://www.myflood.com/getEventDataJson', {
      method: 'GET',
      credentials: 'include',
      headers:
      {
        Accept: 'application/json',
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1',
          // 'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(this.props.eventID),
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
      chartconfig.series = data;
    }).catch((error) => {
      alert(error.toString());
    });
  }

  render() {
    const config = {
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4],
      }],
    };
    return (
      <div>
        <Row>
          <Col span={1}><Icon
            type="info-circle"
            style={{ margin: '2px 0px 3px 0px', fontSize: 18, color: '#08c' }}
          /></Col>
          <Col span={20}><h3>汉江流域事件</h3></Col>
          <Col span={2}><Button type="primary">删除当前事件</Button></Col>
        </Row>

        <Layout>
          <Tabs defaultActiveKey="1" style={{ height: 400 }} type="card">
            <TabPane tab={<span><Icon type="global" />洪涝事件传感器分布图</span>} key="1">
              <Layout>
                <Content style={{ minHeight: 410 }}>
                  <div style={{ height: '400px', width: '80%' }}>
                    <Map amapkey={'788e08def03f95c670944fe2c78fa76f'} />
                  </div>

                </Content>
              </Layout>
            </TabPane>
            <TabPane tab={<span><Icon type="area-chart" />洪涝事件主动服务</span>} key="2">
              <Layout>
                <Sider
                  trigger={null}
                  width={200}
                  style={{ backgroundColor: 'white' }}
                >
                  <Table dataSource={data}>
                    <Column
                      title="First Name"
                      dataIndex="firstName"
                      key="firstName"
                    />
                  </Table>
                </Sider>
                <Icon type="area-chart" />
                <Content style={{ minHeight: 410 }}>
                  <div style={{ height: '400px', width: '100%' }}>
                    <ReactHighcharts config={chartconfig} />
                  </div>
                </Content>
                <Sider width={150}>
                  <div>主动服务</div>
                </Sider>
              </Layout>
            </TabPane>
            <TabPane tab={<span><Icon type="bank" />洪涝事件过程信息模型</span>} key="3">
              Tab 2
            </TabPane>
          </Tabs>
        </Layout>
      </div>
    );
  }
}
