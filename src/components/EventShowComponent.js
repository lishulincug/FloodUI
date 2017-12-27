import React from 'react';
import { Row, Col, Icon, Layout, Button, Tabs, Table } from 'antd';
import { Map } from 'react-amap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { ChartComponent } from './ChartComponent';

const { Sider, Content } = Layout;
const { Column } = Table;
const TabPane = Tabs.TabPane;

const dataChart = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];
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
export class EventShowComponent extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={1}><Icon type="info-circle" style={{ margin: '2px 0px 3px 0px', fontSize: 18, color: '#08c' }} /></Col>
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
                  <div style={{ height: '400px', width: '95%' }}>
                    <ResponsiveContainer>
                      <AreaChart
                        data={dataChart}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Content>
                <Sider width={100}>
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
