import React from 'react';
import { Steps, Button, message, Input, Table } from 'antd';
import styles from './EventSubscribeComponent.css';
import { Link } from 'dva/router';
import fetch from 'dva/fetch';

const Step = Steps.Step;
const Column = Table;
// const steps = [{
//   title: '选择水文数据集',
//   content: <div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}>进入传感器</Button></div>,
// }, {
//   title: '构建过程信息订阅模型',
//   content: '<div>',
// }, {
//   title: '设置接收地址（邮箱）',
//   content: <div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" /></div>,
// }];

export class EventSubscribeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      current: 0,
      stepsStatus: null,
    };
  }
  componentDidMount() {
    // Fetch 获取存储于Session中的Json数据
    fetch('http://www.myflood.com/getSubScribeJson', { method: 'GET',credentials: 'include' }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    },
    ).then((data) => {
      this.setState({
        stepsStatus: data,
      });
    }).catch((error) => {
      alert(error);
    });
  }
  change=(e) => {
    this.setState({
      email: e.target.value,
    });
  }
  createContent=() => {
    const sensorData = this.state.stepsStatus.dataset.sensorList;
    if (this.state.current == 0) {
      if (this.state.stepsStatus.dataset.flag) {
        return (
          <div>
            <h3>当前已选择数据集情况如下：</h3>
            <br />
            <Table dataSource={sensorData}>
              <Column dataIndex="sensorID" title="传感器ID" />
              <Column dataIndex="propertyID" title="传感器属性ID" />
            </Table>
          </div>);
      } else {
        return (<div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}><a href="http://www.myflood.com/registerEvent">进入传感器选择页面</a></Button></div>);
      }
    }
    if (this.state.current == 1) {
      if (this.state.stepsStatus.event.flag) {
        return (<div><h2>事件ID:{this.state.stepsStatus.event.eventID}</h2><br />
          <label>准备阶段时间窗口：</label>{0}
        </div>);
      } else {
        return (<div>进入选择洪涝事件过程信息模型参数设置页面：<Button type={'primary'}><Link to="/params">进入参数设置页面</Link></Button></div>);
      }
    }
    if (this.state.current == 2) return <div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" value={this.state.email} onChange={this.change} /></div>;
  }
  // 以Session作为状态存储的对象
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const steps = [{
      title: '选择水文数据集',
      content: <div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}><a href="http://www.myflood.com/registerEvent">进入传感器选择页面</a></Button></div>,
    }, {
      title: '构建过程信息订阅模型',
      content: <div>进入选择洪涝事件过程信息模型参数设置页面：<Button type={'primary'}><a to="/www.myflood.com/simpleSubscribeEvent">进入参数设置页面</a></Button></div>,
    }, {
      title: '设置接收地址（邮箱）',
      content: <div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" value={this.state.email} onChange={this.change} /></div>,
    }];
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.content}>{this.state.stepsStatus == null ? steps[this.state.current].content : this.createContent()}</div>
        <div className={styles.action}>
          {
            this.state.current < steps.length - 1
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
          }
          {
            this.state.current > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          }
        </div>
      </div>
    );
  }
}

