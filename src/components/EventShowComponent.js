import React from 'react';
import {Row, Col, Icon, Layout, Button, Tabs, Table, Tree, Card,Tag ,Timeline} from 'antd';
import {Map, Markers, InfoWindow} from 'react-amap';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import bpimg from '../assets/BP.png';

// import { routerRedux } from 'dva/router';

// function reducers(state = 1, action) {
//   switch (action.type) {
//     case 'Done':
//       return state + action.payload;
//     default:
//       return state;
//   }
// };
const TreeNode = Tree.TreeNode;
const {Sider, Content} = Layout;
const {Column} = Table;
const TabPane = Tabs.TabPane;
const ReactHighcharts = require('react-highcharts');
ReactHighcharts.Highcharts.setOptions({
  global:{
    useUTC:false
  }
});
const Highcharts = require('highcharts');

// const chartconfig = {
//   chart: {
//     zoomType: 'x',
//   },
//   title: {
//     text: '洪涝事件探测结果阶段划分图',
//   },
//   subtitle: {
//     text: '异常事件',
//   },
//   xAxis: {
//     type: 'datetime',
//     labels: {
//       format: '{value:%y-%m-%d %H:%M}',
//       align: 'right',
//       rotation: -30,
//     },
//   },
//   series: null,
// };
 const divStyle = {
  color: 'red',
  backgroundImage: 'url(../assets/BP.png)',
  // 或者 background: `url${require("1.jpg")}`
};

export class EventShowComponent extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  state = {
    eventID: '',
    floodResult:null,
    propertys: [],
    sensors: null,
    markers: {
      position: {
        longitude: 115,
        latitude: 30,
      },
    },
    currentMarker: null,
    visible: true,
    selectedRowKeys: [],
    center: {longitude: 120.1, latitude: 30.1},
    activeServiceStatus: '无事件',
    chartconfig: {
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
    },
    currentMessage:null,
    predictConfig:null,
    statisticMessage:null
  };

  constructor(props, context) {
    super(props, context);
    // alert(this.props.eventID);
    // 根据eventID获取事件的名称，事件的传感器信息，事件的基本参数信息
    // 获取当前页面的基本信息
    // alert(this.props.eventID);
    // this.showChart();
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
    this.setState({
      eventID: this.props.eventID,
    });
  }

  componentDidMount() {
    // this.interval = setInterval(() => fetch('http://www.myflood.com/getEventStatus', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers:
    //   {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    //   body: this.props.eventID,
    // }).then((response) => {
    //   if (response.status >= 200 && response.status < 300) {
    //     return response.json();
    //   } else {
    //     const error = new Error(response.statusText);
    //     error.response = response;
    //     throw error;
    //   }
    // },
    // ).then((data) => {
    //   if (data.flag) {
    //     this.setState({
    //       activeServiceStatus: data.object,
    //     });
    //   } else {
    //     const path = {
    //       pathname: '/error',
    //       query: data.message,
    //     };
    //     this.context.router.history.push(path);
    //   }
    // }), 1000);
    // this.showChart();
    // 获取传感器的基本信息
    fetch('http://www.myflood.com/getEventBaseData', {
      method: 'POST',
      credentials: 'include',
      headers:
        {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      body: this.props.eventID,
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
        // 构建一个数组，用于存储所有的传感器数据
        var predictSensors = data.object.dataset.sensors;
        var statisticSensors=data.object.sensors;
        var sensors = new Array();
        for(var i=0;i<predictSensors.length;i++) {
          sensors.push(predictSensors[i]);
        }
        for (var i=0;i<statisticSensors.length;i++) {
          sensors.push(statisticSensors[i]);
        }
        console.log(sensors);
        this.setState({
          floodResult: data.object,
          sensors: sensors,
          propertys: data.object.propertys,
          center: {
            longitude: data.object.dataset.diagnosisSensor.lon,
            latitude: data.object.dataset.diagnosisSensor.lat
          },
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
  //     if (true) {
  //       this.setState({
  //         chartconfig: {
  //           chart: {
  //             zoomType: 'x',
  //           },
  //           title: {
  //             text: '洪涝事件探测结果阶段划分图',
  //           },
  //           subtitle: {
  //             text: '异常事件',
  //           },
  //           xAxis: {
  //             type: 'datetime',
  //             labels: {
  //               format: '{value:%y-%m-%d %H:%M}',
  //               align: 'right',
  //               rotation: -30,
  //             },
  //           },
  //           series: d,
  //         },
  //       });
  //       this.runPolling(generator);
  //     } else {
  //       console.log(d);
  //     }
  //   });
  // }
  showChart = () => {
    // clearInterval(this.interval);
    fetch('http://www.myflood.com/getEventDataJson', {
      method: 'POST',
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
      if (data.flag) {
        this.setState({
          chartconfig: {
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
            series: eval(`(${data.object})`),
          },
        });
      }
    }).catch((error) => {
      alert(error.toString());
    });
  }
  showChartWithID = (sensorID, propertyID) => {
    fetch('http://www.myflood.com/getPropertyDataJson', {
      method: 'POST',
      credentials: 'include',
      headers:
        {
          Accept: 'application/json',
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1',
          // 'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json; charset=utf-8',
        },
      body: JSON.stringify({eventID: this.props.eventID, sensorID: sensorID, propertyID: propertyID}),
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
      data.flag ? this.setState({
        chartconfig: {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: '洪涝事件探测结果阶段划分图',
          },
          subtitle: {
            text: '异常事件',
          },
          plotOptions: {
            series: {turboThreshold: 100000}
          },yAxis:{
            title: {
              text: '水位'
            }, labels: {
              formatter: function() {
                return this.value +'m';
              }
          }},
          xAxis: {
            type: 'datetime',
            labels: {
              format: '{value:%y-%m-%d %H:%M}',
              align: 'right',
              rotation: -30,
            },
          },
          series: eval(`(${data.object})`),
        },
      }) : null;
    }).catch((error) => {
      alert(error.toString());
    });
  };

  // 当选中准备响应恢复阶段的树时触发函数
  onSelect = (selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      if (selectedRowKeys == '0-0-0-0') {
        this.setState({
          center: {
            longitude: this.state.floodResult.dataset.diagnosisSensor.lon,
            latitude: this.state.floodResult.dataset.diagnosisSensor.lat
          },
        });
      }
      if (selectedRowKeys == '0-0-1-0') {
        this.setState({
          center: {
            longitude: this.state.floodResult.dataset.prepareSensor.lon,
            latitude: this.state.floodResult.dataset.prepareSensor.lat
          },
        });
      }
      if (selectedRowKeys == '0-0-2-0') {
        this.setState({
          center: {
            longitude: this.state.floodResult.dataset.responseSensor.lon,
            latitude: this.state.floodResult.dataset.responseSensor.lat
          },
        });
      }
      if (selectedRowKeys == '0-0-3-0') {
        this.setState({
          center: {
            longitude: this.state.floodResult.dataset.recoverySensor.lon,
            latitude: this.state.floodResult.dataset.recoverySensor.lat
          },
        });
      }
    }
  }
  predictSelect=(selectedRowKeys)=>{
    if(selectedRowKeys.length<=0) return;

    console.log(selectedRowKeys);
    var keys = selectedRowKeys[0].split("-");
    if (keys.length<=2) return;
    this.setState({
      center: {
        longitude: this.state.floodResult.dataset.sensors[parseInt(keys[2])].lon,
        latitude: this.state.floodResult.dataset.sensors[parseInt(keys[2])].lat
      },
    })
  }
  predictSensorTreeShow=()=>{
    if (this.state.floodResult==null) return ( <TreeNode title="洪涝过程预测模型传感器属性" key="0-0"><TreeNode key="0-0-1" title="没有传感器属性"></TreeNode></TreeNode>);
    else {
      //计算key值
      var predictSensors = this.state.floodResult.dataset.sensors;
      for(var i=0;i<predictSensors.length;i++) {
        var key="0-0-" + i;
        predictSensors[i].key = "0-0-" + i;
        var properties=predictSensors[i].observedProperties;
        for (var j=0;j<properties.length;j++) {
          properties[j].key = key + "-" + j;
        }
      }
      console.log(predictSensors);
      return<TreeNode title="洪涝过程预测模型传感器属性" key="0-0">
        {predictSensors.map((sensor)=>{
         return <TreeNode key={sensor.key} title={sensor.sensorName}>{sensor.observedProperties.map((property)=>{
           return <TreeNode key={property.key} title={property.propertyName}></TreeNode>
          })}</TreeNode>
        })}
      </TreeNode>;
    }
  }

  alertDetail=(text, record, index)=>{
    return(
    <Button type={'primary'} onClick={()=>{
      this.setState({
        currentMessage:record.message
      })
    }}>查看详情</Button>);
  }

  predictDetail=(text, record, index)=>{
    return(
      <Button type={'primary'} onClick={()=>{
        this.setState({
          predictConfig:eval(`(${record.plotRes})`)
        })
      }}>查看详情</Button>);
  }
  statisticDetail=(text, record, index)=>{
    return ( <Button type={'primary'} onClick={() => {
      this.setState({
        statisticMessage: record
      })
    }}>查看详情</Button>);
  }
  operator = (text, record, index) => {
    return (<Button
      type={'primary'} size={'small'} onClick={() => {
      this.showChartWithID(record.sensorID, record.propertyID);
    }
    }
    >加载数据</Button>);
  }
drawTimeLine=()=>{
    return (
      <Timeline>
        <Timeline.Item color='#91e8e1'>{this.state.statisticMessage.diagnosisStartTime} 洪涝事件处于诊断阶段</Timeline.Item>
        <Timeline.Item color='#f7a35c'>{this.state.statisticMessage.prepareStartTime}洪涝事件进入准备阶段</Timeline.Item>
        <Timeline.Item color='#f15c80'>{this.state.statisticMessage.responseStartTime}洪涝事件进入响应阶段</Timeline.Item>
        <Timeline.Item color='blue'>{this.state.statisticMessage.maxWaterLevelTime}当前洪涝事件达到水位最大值{this.state.statisticMessage.maxWaterLevel}m</Timeline.Item>
        <Timeline.Item color='#90ed7d'>{this.state.statisticMessage.recoveryStartTime}洪涝事件进入恢复阶段</Timeline.Item>
        <Timeline.Item color='#91e8e1'>{this.state.statisticMessage.recoveryEndTime}洪涝事件结束，水位恢复到正常，事件处于诊断阶段</Timeline.Item>
      </Timeline>

    )
}
  render() {
    // const config = {
    //   xAxis: {
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //   },
    //   series: [{
    //     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4],
    //   }],
    // };
    return (
      <div>
        <Row>
          <Col span={1}><Icon
            type="info-circle"
            style={{margin: '2px 0px 3px 0px', fontSize: 18, color: '#08c'}}
          /></Col>
          <Col span={20}>
            <h3>{this.state.floodResult == null ? '没有数据' : this.state.floodResult.params.userDefineName}</h3></Col>
          <Col span={2}><Button type="primary">删除当前事件</Button></Col>
        </Row>

        <Layout>
          <Tabs defaultActiveKey="1" style={{height: 1000}} type="card">
            <TabPane tab={<span><Icon type="global"/>洪涝事件传感器分布图</span>} key="1">
              <Layout>
                <Content style={{minHeight: 1000}}>
                  <div style={{height: '980px'}}>
                    <Map center={this.state.center} plugins={['ToolBar']}>
                      <Markers
                        // render={this.renderMarkerFn}
                        markers={this.state.sensors != null ? this.state.sensors.map((e, i) => {
                          const position = {longitude: e.lon, latitude: e.lat};
                          return {
                            position,
                            // 这个属性就可以用来确定点击的是哪个坐标点
                            myIndex: i,
                          };
                        }) : this.markers}
                        events={this.markersEvents}
                        useCluster
                      />
                      {this.state.currentMarker != null ?
                        <InfoWindow
                          position={this.state.currentMarker == null ? this.state.markers.position : this.state.currentMarker.position}
                          visible={this.state.visible}
                          isCustom={false}
                          showShadow
                          content={`<div><table border="1"><tbody><tr><td><h3 style="color: orangered;">传感器编号：</h3> </td> <td style="width: 100px">${this.state.sensors[this.state.currentMarker.myIndex].sensorID}</td>
</tr> <tr><td><h3 style="color: orangered;">传感器名称</h3></td> <td style="width: 100px">${this.state.sensors[this.state.currentMarker.myIndex].sensorName} </td> </tr> </tbody>
</table></div>`}
                          offset={[0, 0]}
                        /> : <div/>}

                    </Map>
                  </div>

                </Content>
                <Sider
                  trigger={null}
                  width={200}
                  style={{backgroundColor: 'white',overflow:'auto'}}
                >
                  {/* {this.state.floodResult!=null ? alert(JSON.parse(this.state.floodResult)) : null}*/}
                  <Tree
                    defaultExpandedKeys={['0-0']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    onSelect={this.onSelect}
                  >
                    <TreeNode title="洪涝过程统计模型传感器属性" key="0-0">
                      <TreeNode title="诊断阶段" key="0-0-0">
                        <TreeNode
                          title={this.state.floodResult != null ? `${this.state.floodResult.dataset.diagnosisSensor.sensorName}` : '没有数据'}
                          key="0-0-0-0">
                          {this.state.floodResult != null ?
                            <TreeNode title={this.state.floodResult.dataset.diagnosisProperty.propertyName}
                                      key="0-0-0-0-0"/> : <div/>}
                        </TreeNode>
                      </TreeNode>
                      <TreeNode title="准备阶段" key="0-0-1">
                        <TreeNode
                          title={this.state.floodResult != null ? `${this.state.floodResult.dataset.prepareSensor.sensorName}` : '没有数据'}
                          key="0-0-1-0">
                          {this.state.floodResult != null ?
                            <TreeNode title={this.state.floodResult.dataset.prepareProperty.propertyName}
                                      key="0-0-1-0-0"/> : <div/>}
                        </TreeNode>
                      </TreeNode>
                      <TreeNode title="响应阶段" key="0-0-2">
                        <TreeNode
                          title={this.state.floodResult != null ? `${this.state.floodResult.dataset.responseSensor.sensorName}` : '没有数据'}
                          key="0-0-2-0">
                          {this.state.floodResult != null ?
                            <TreeNode title={this.state.floodResult.dataset.responseProperty.propertyName}
                                      key="0-0-2-0-0"/> : <div/>}
                        </TreeNode>
                      </TreeNode>
                      <TreeNode title="恢复阶段" key="0-0-3">
                        <TreeNode
                          title={this.state.floodResult != null ? `${this.state.floodResult.dataset.recoverySensor.sensorName}` : '没有数据'}
                          key="0-0-3-0">
                          {this.state.floodResult != null ?
                            <TreeNode title={this.state.floodResult.dataset.recoveryProperty.propertyName}
                                      key="0-0-3-0-0"/> : <div/>}
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                  </Tree>
                  <Tree defaultExpandedKeys={['0-0']} onSelect={this.predictSelect}>
                    {this.predictSensorTreeShow()}
                  </Tree>
                </Sider>
              </Layout>
            </TabPane>
            <TabPane tab={<span><Icon type="area-chart"/>洪涝事件主动服务</span>} key="2">
              <Layout>
                <Sider
                  trigger={null}
                  width={250}
                  style={{backgroundColor: 'white'}}
                >
                  <Table dataSource={this.state.propertys}>
                    <Column
                      title="传感器名称"
                      dataIndex="sensorName"
                      key="sensorName"
                    />
                    <Column
                      title="观测属性"
                      dataIndex="propertyName"
                      key="propertyName"
                    />
                    <Column title="查看数据" key="propertyID" render={this.operator}/>
                  </Table>
                </Sider>
                <Content style={{minHeight: 425}}>
                  <div style={{height: '400px', width: '100%'}}>
                    <ReactHighcharts config={this.state.chartconfig}/>
                    <div style={{textAlign:"center"}}>
                      <Tag color="#7cb5ec">无事件（NoEvent）</Tag>
                      <Tag color="#91e8e1">诊断阶段（diagnosis）</Tag>
                      <Tag color="#f7a35c">准备阶段(prepare)</Tag>
                      <Tag color="#f15c80">响应阶段(response)</Tag>
                      <Tag color="#90ed7d">恢复阶段(response)</Tag>
                    </div>
                  </div>
                </Content>
                <Sider width={150} style={{backgroundColor: 'white'}}>
                  <h1>事件状态：</h1>
                  <div>{this.state.activeServiceStatus}</div>
                </Sider>
              </Layout>
              <br/>
              <hr/>
              <br/>
              <Layout>
                <Content style={{minHeight: 480,backgroundColor:"white"}}>
                  <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                    type="card"
                    style={{ height: 480}}
                  >
                    <TabPane tab="洪涝预警记录" key="1">
                      <Row>
                        <Col span={13}>
                          <Table dataSource={this.state.floodResult==null?null:this.state.floodResult.results.alert} pagination={{defaultPageSize: 6}}>
                            <Column
                              title="编号"
                              dataIndex="key"
                            />
                            <Column
                              title="时间"
                              dataIndex="time"
                            />
                            <Column
                              title="消息主题"
                              dataIndex="subject"
                            />
                            <Column
                              title="详情"
                              render={this.alertDetail}
                            />
                          </Table>
                      </Col>
                        <Col span={1}/>
                        <Col span={8}>
                          <h2>当前洪涝预警详细内容</h2>
                          <div style={{textAlign:'left',wordBreak:'break-all',wordWrap:'break-word'}}>{this.state.currentMessage==null?"当前无消息内容":this.state.currentMessage}</div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab="洪涝预测记录" key="2"> <Row>
                      <Col span={13}>
                        <Table dataSource={this.state.floodResult==null?null:this.state.floodResult.results.predict} pagination={{defaultPageSize: 6}}>
                          <Column
                            title="编号"
                            dataIndex="key"
                          />
                          <Column
                            title="预测时间"
                            dataIndex="predictTime"
                          />
                          <Column
                            title="预测时事件阶段"
                            dataIndex="subject"
                          />
                          <Column
                            title="预测误差RMSE"
                            dataIndex="predictError"
                          />
                          <Column
                            title="制图详情"
                            render={this.predictDetail}
                          />
                        </Table>
                      </Col>
                      <Col span={1}/>
                      <Col span={8}>
                        <div style={{height:'480px',width:'100%'}}><ReactHighcharts config={this.state.predictConfig}/></div>
                      </Col>
                    </Row></TabPane>
                    <TabPane tab="洪涝统计记录" key="3">
                      <Row>
                        <Col span={13}>
                          <Table dataSource={this.state.floodResult==null?null:this.state.floodResult.results.statistic} pagination={{defaultPageSize: 6}}>
                            <Column
                              title="编号"
                              dataIndex="key"
                            />
                            <Column
                              title="洪涝事件开始时间"
                              dataIndex="startTime"
                            />
                            <Column
                              title="洪涝事件结束时间"
                              dataIndex="endTime"
                            />
                            <Column
                              title="准备阶段持续时长(小时)"
                              dataIndex="prepareDuration"
                            />
                            <Column
                              title="响应阶段持续时长(小时)"
                              dataIndex="responseDuration"
                            />
                            <Column
                              title="恢复阶段持续时长(小时)"
                              dataIndex="recoveryDuration"
                            />
                            <Column
                              title="阶段详情"
                              render={this.statisticDetail}
                            />
                          </Table>
                        </Col>
                        <Col span={1}/>
                        <Col span={8}>
                          <div style={{height:'480px',width:'100%'}}>
                            {/*绘制时间轴*/}
                            <br/>
                            <div style={{width:'100%',textAlign:'center'}}> <h2>洪涝事件过程信息详情</h2></div>
                            <br/>
                            {this.state.statisticMessage!=null?this.drawTimeLine():"当前无洪涝事件过程信息！"}
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                  {/*<Row>*/}
                    {/*/!*<Col span={7}></Col>*!/*/}
                    {/*/!*<Col span={1}></Col>*!/*/}
                    {/*/!*<Col span={7}></Col>*!/*/}
                    {/*/!*<Col span={1}></Col>*!/*/}
                    {/*/!*<Col span={7}></Col>*!/*/}
                  {/*</Row>*/}
                </Content>
              </Layout>
            </TabPane>
            <TabPane tab={<span><Icon type="bank"/>洪涝事件过程信息模型</span>} key="3">
              {this.state.floodResult == null ? <div>无洪涝事件模型参数</div> : <div style={{background: '#ECECEC'}}>
                <h1>1.洪涝过程统计模型</h1>
                <br/>
                <Row gutter={16}>

                  <Col span={6}>
                    <Card title="1.诊断阶段参数" bordered={false}>
                      <h4><b>传感器名称：</b>{this.state.floodResult.dataset.diagnosisSensor.sensorName}</h4>
                      <h4><b>传感器属性：</b>{this.state.floodResult.dataset.diagnosisProperty.propertyName}</h4>
                      <h4>
                        <b>阈值：</b>{this.state.floodResult.params.diagnosisThreshold}{this.state.floodResult.params.diagnosisUnit}
                      </h4>
                      <h4><b>重复次数：</b>{this.state.floodResult.params.diagnosisRepeatTimes}次</h4>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="2.准备阶段参数" bordered={false}>
                      <h4><b>传感器名称：</b>{this.state.floodResult.dataset.prepareSensor.sensorName}</h4>
                      <h4><b>传感器属性：</b>{this.state.floodResult.dataset.prepareProperty.propertyName}</h4>
                      <h4>
                        <b>阈值：</b>{this.state.floodResult.params.prepareThreshold}{this.state.floodResult.params.prepareUnit}
                      </h4>
                      <h4><b>重复次数：</b>{this.state.floodResult.params.prepareRepeatTimes}次</h4>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="3.响应阶段参数" bordered={false}>
                      <h4><b>传感器名称：</b>{this.state.floodResult.dataset.responseSensor.sensorName}</h4>
                      <h4><b>传感器属性：</b>{this.state.floodResult.dataset.responseProperty.propertyName}</h4>
                      <h4>
                        <b>阈值：</b>{this.state.floodResult.params.responseThreshold}{this.state.floodResult.params.responseUnit}
                      </h4>
                      <h4><b>重复次数：</b>{this.state.floodResult.params.responseRepeatTimes}次</h4>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="4.恢复阶段参数" bordered={false}>
                      <h4><b>传感器名称：</b>{this.state.floodResult.dataset.recoverySensor.sensorName}</h4>
                      <h4><b>传感器属性：</b>{this.state.floodResult.dataset.recoveryProperty.propertyName}</h4>
                      <h4>
                        <b>阈值：</b>{this.state.floodResult.params.recoveryThreshold}{this.state.floodResult.params.recoveryUnit}
                      </h4>
                      <h4><b>重复次数：</b>{this.state.floodResult.params.recoveryRepeatTimes}次</h4>
                    </Card>
                  </Col>
                </Row>
                <br/>
                <h1>2.洪涝过程预测模型</h1>
                <br/>
                <Row>
                  <Col span={3}/>
                  <Col span={10}>
                    {/*<div style={divStyle}></div>*/}
                    <div style={{display:"table-cell",verticalAlign:"middle",textAlign:"center"}}><img src={bpimg} style={{width:'auto',height:'auto',maxWidth:'100%',maxHeight: '100%',textAlign:'right'}}/></div>
                    <br/>
                    <div style={{textAlign:'center'}}><h2>BP神经网络水位预测原理图</h2></div>
                  </Col>
                  <Col span={1}/>
                  <Col span={6}>
                    <Card title="洪涝过程预测模型参数" bordered={false}>
                      <h4><b>网络类型：</b>后向反馈神经网络（Back Propagation Network,BP神经网络）</h4>
                      <h4><b>网络输入节点数：</b>{this.state.floodResult.params.sensorPropertyIDs.length}</h4>
                      <h4><b>第一层隐含层节点数：</b>{Math.floor(Math.sqrt(this.state.floodResult.params.sensorPropertyIDs.length+1))}</h4>
                      <h4><b>第二层隐含层节点数：</b>{Math.floor(Math.sqrt(this.state.floodResult.params.sensorPropertyIDs.length+1))+3}</h4>
                      <h4><b>输出层节点数：</b>1</h4>
                      <h4><b>学习速率：</b>{this.state.floodResult.params.learningRate}</h4>
                      <h4><b>迭代次数上限：</b>{this.state.floodResult.params.maxIterations}</h4>
                      <h4><b>误差上限：</b>{this.state.floodResult.params.maxError}</h4>
                    </Card>
                  </Col>
                </Row>
              </div>}

            </TabPane>
          </Tabs>
        </Layout>
      </div>
    );
  }
}
