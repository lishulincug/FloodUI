import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'dva/router';
import {Row, Col, Icon, Layout, Button, Tabs, Table, Tree, Card} from 'antd';

const {Column} = Table;

export class UserEventCenterComponent extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  state = {
    event: [],
  }

  //获取事件的基本信息服务
  componentDidMount() {
    fetch('http://www.myflood.com/getEventParamsByUserID', {
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
        // 构建一个数组,加入key值，构建数组
        var events = new Array();
        var count=1;
        for (var i = 0; i < data.object.length; i++) {
          const oneEvent = {};
          oneEvent.key = count;
          oneEvent.eventID = data.object[i].eventID;
          oneEvent.eventSesID = data.object[i].eventSesID;
          oneEvent.userDefineName = data.object[i].userDefineName;
          events.push(oneEvent);
          count++
        }
        this.setState({
          event: events,
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

  //点击跳转到对应的洪涝展示事件界面
  showEventInfo = (text, record, index) => {
    return <Button type="primary"><Link to={`/show/${record.eventSesID}`}>查看事件详细信息</Link></Button>;
  }
  deleteEvent = (text, record, index) => {
    return <Button type="primary">删除事件</Button>;
  }

  render() {
    //构建事件table。用于展示事件的基本信息
    return (
      <div>
       <div style={{"text-align": "center", padding:10}}><h1>当前用户订阅洪涝事件表</h1></div>
        <br/>
        <br/>
        <Table dataSource={this.state.event} pagination={{defaultPageSize: 10}}>
          <Column
            title="编号"
            dataIndex="key"
          />
          <Column
            title="洪涝事件ID"
            dataIndex="eventID"
          />
          <Column
            title="洪涝事件名称"
            dataIndex="userDefineName"
          />
          <Column title="查看详情" render={this.showEventInfo}/>
          <Column title="删除订阅" render={this.deleteEvent}/>
        </Table>
      </div>
    )

  }
}
