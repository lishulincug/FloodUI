import React from 'react';
import { Tabs, Icon, Layout } from 'antd';
import { ChartComponent } from './ChartComponent';
import { TableComponent } from './TableComponent';
import { MapComponent } from './MapComponent';

const { Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
export class TabComponent extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="2" style={{ height: 400 }}>
        <TabPane tab={<span><Icon type="global" />洪涝事件传感器分布图</span>} key="1">
          <Layout>
            <Content style={{ minHeight: 410 }}>
              <div style={{ height: '400px',width:'80%' }}>
                <MapComponent />
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
              <TableComponent />
            </Sider>
            <Icon type="area-chart" />
            <Content style={{ minHeight: 410 }}>
              <div style={{ height: '400px', width: '95%' }}>
                <ChartComponent />
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
    );
  }
}

