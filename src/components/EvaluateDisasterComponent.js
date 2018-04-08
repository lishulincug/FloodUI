import React from 'react';
import { Layout, Form, DatePicker, Button, Select, Table, Modal } from 'antd';
import { Map, MouseTool } from 'react-amap';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Column } = Table;
const { Sider, Content } = Layout;

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px',
};

const data = [{
  key: '1',
  theme: '洪涝事件',
  time: '2017-10-11',
  spatial: 'Point(112,36)',
  event: '汉江流域事件',
  url: '/api/image',
}, {
  key: '2',
  theme: '洪涝事件',
  time: '2017-10-11',
  spatial: 'Point(112,36)',
  event: '汉江流域事件',
  url: '/api/image',
}, {
  key: '3',
  theme: '洪涝事件',
  time: '2017-10-11',
  spatial: 'Point(112,36)',
  event: '汉江流域事件',
  url: '/api/image',
}];
export class DisasterComponent extends React.Component {
  // const rangeTimeValue = fieldsValue['range-time-picker'];

  state = { visible: false }
  constructor() {
    super();
    const self = this;
    this.toolEvents = {
      created: (tool) => {
        console.log(tool);
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
    this.mapPlugins = ['ToolBar'];
    // this.mapCenter = { longitude: 120, latitude: 35 };
  }
  drawWhat(obj) {
    let text = '';
    switch (obj.CLASS_NAME) {
      case 'AMap.Marker':
        text = `你绘制了一个标记，坐标位置是 {${obj.getPosition()}}`;
        break;
      case 'AMap.Polygon':
        text = `你绘制了一个多边形，有${obj.getPath().length}个端点`;
        this.tool.close();
        break;
      case 'AMap.Circle':
        text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}}`;
        break;
      default:
        text = '';
    }
    this.setState({
      what: text,
    });
  }
  drawRectangle() {
    if (this.tool) {
      this.tool.close(true);
      this.tool.rectangle();
      this.setState({
        what: '准备绘制多边形（矩形）',
      });
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <div>
        <Layout>

          <Sider
            width={300}
            style={{ backgroundColor: 'white' }}
          >
            {/* 图片上传，与图片查询操作界面*/}
            <div>
              <h1>查询条件</h1>
              <br />
              <hr />
              <Form>
                <FormItem label={'空间查询'}>
                  <Button type={'primary'} size={'small'} onClick={this.showModal}>选择空间范围</Button>
                </FormItem>
                <FormItem
                  label={'时间查询'}
                >
                  {getFieldDecorator('range-time-picker', rangeConfig)(
                    <RangePicker size={'small'} style={{ width: 300 }} showTime format="YYYY-MM-DD HH:mm:ss" />,
                  )}
                </FormItem>
                <FormItem label={'选择主题'}>
                  <Select style={{ width: 200 }} size={'small'}>
                    <Option value="flood">洪涝灾害</Option>
                    <Option value="road">路域灾害</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type={'primary'} size={'small'}>查询</Button>
                </FormItem>
              </Form>

              <Modal
                title="选择地图范围"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <div style={{ height: '200px' }}>
                  <Map
                    plugins={this.mapPlugins}
                    // center={this.mapCenter}
                    amapkey={'788e08def03f95c670944fe2c78fa76f'}
                  >
                    <MouseTool events={this.toolEvents} />
                    <div style={layerStyle}>{this.state.what}</div>
                  </Map>
                </div>
                <button onClick={() => { this.drawRectangle(); }}>Draw Rectangle</button>
              </Modal>
            </div>
          </Sider>
          <Content style={{ margin: '0px 0px 0px 12px', padding: 0, background: '#fff', minHeight: 1000 }}>
            <Table dataSource={data}>
              <Column
                title="编号"
                dataIndex="key"
                key="key"
              />
              <Column
                title="灾害主题"
                dataIndex="theme"
                key="theme"
              />
              <Column
                title="时间"
                dataIndex="time"
                key="time"
              />
              <Column
                title="空间"
                dataIndex="spatial"
                key="spatial"
              />
              <Column
                title="在地图上查看"
                dataIndex="url"
                key="url"
              />
            </Table>
          </Content>
        </Layout>
      </div>
    );
  }
}
export const EvaluateDisasterComponent = Form.create()(DisasterComponent);
