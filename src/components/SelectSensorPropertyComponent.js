import React from 'react';
import { Layout, Button, Table } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';

const { Sider, Content } = Layout;
const { Column } = Table;

export class SelectSensorPropertyComponent extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  state = {
    selectedRows: null,
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
    center: { longtitude: 120, latitude: 30 },
  }

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
        _this.setState({ currentMarker: extData, visible: !visi });
      },
    };
    // this.renderMarkerFn = extData => (
    //   <div>{extData.myIndex}</div>
    // );
  }

  componentDidMount() {
    // Fetch 获取存储于Session中的Json数据
    fetch('http://www.myflood.com/getSensorInfo', { method: 'POST' }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    },
    ).then((data) => {
      // 构建Sensor_property的table
      if (data == null) return;
      const properys = new Array();
      var count=0;
      for (let i = 0; i < data.length; i++) {
        const obs = data[i].observedProperties;
        for (let j = 0; j < obs.length; j++) {
          const oneProperty = {};
          oneProperty.key = count;
          oneProperty.sensorID = data[i].sensorID;
          oneProperty.sensorName = data[i].sensorName;
          oneProperty.lat = data[i].lat;
          oneProperty.lon = data[i].lon;
          oneProperty.propertyID = obs[j].propertyID;
          oneProperty.propertyName = obs[j].propertyName;
          oneProperty.unit = obs[j].unit;
          properys.push(oneProperty);
          count++;
        }
      }

      this.setState({
        sensors: properys,
      });
    }).catch((error) => {
      throw error;
    });
  }


  // onSelectTable=(record, selected, selectedRows) => {
  //   if (selected) {
  //     this.setState(
  //       { selectedRows:selectedRows,
  //         center: { longitude: record.lon, latitude: record.lat } });
  //   }
  // }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    if (selectedRowKeys.length > 0) {
      const key = parseInt(selectedRowKeys[selectedRowKeys.length - 1]);
      this.setState({
        selectedRowKeys,
        selectedRows,
        center: { longitude: this.state.sensors[key].lon, latitude: this.state.sensors[key].lat },
      });
    } else {
      this.setState({ selectedRowKeys,selectedRows });
    }
  }
  // 上传选中的传感器ID
  onClickFinish = () => {
    alert()
    if (this.state.selectedRows==null||this.state.selectedRows.length == 0) { alert('请先选择传感器，再完成数据集'); return; }
    var propertys = new Array();
    for (var i=0;i<this.state.selectedRows.length;i++) {
      var oneProperty = {};
      oneProperty.sensorID = this.state.selectedRows[i].sensorID;
      oneProperty.observedPropertyID = this.state.selectedRows[i].propertyID;
      propertys.push(oneProperty);
    }
    fetch('http://www.myflood.com/getSelectPropertiesJson', { method: 'POST',
      credentials: 'include',
      headers:
      { Accept: 'application/json',
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1',
          // 'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(propertys) }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      },
    ).then((data) => {
      // this.props.history.push('/subscribe');
      // if (data)
      data.flag ? this.context.router.history.push('/subscribe') : alert(data.message);
    }).catch((error) => {
      throw error;
    });
  }

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
      // onSelect: this.onSelectTable,
    };
    return (
      <Layout>
        <Sider
          trigger={null}
          width={400}
          style={{ backgroundColor: 'white' }}
        >
          <Table
            dataSource={this.state.sensors} pagination={{ defaultPageSize: 6 }} rowSelection={rowSelection}>
            <Column
              title="传感器名称"
              dataIndex="sensorName"
              // key="sensorName"
            />
            <Column
              title="属性名称"
              dataIndex="propertyName"
              // key="propertyName"
            />
          </Table>
          <Button
            type={'primary'} onClick={this.onClickFinish} size={'middle'} style={{
              position: 'absolute',
              left: '0px',
              bottom: '0px',
              width: '100%',
              border: '1px',
            }}
          >完成传感器选择</Button>
        </Sider>
        <Content style={{ minHeight: 1000 }}>
          <div style={{ height: '1000px', width: '100%' }}>
            {/* {this.state.currentMarker != null ? alert(this.state.currentMarker.position.latitude) : null}*/}
            <Map plugins={['ToolBar']} center={this.state.center}>
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
                  // size={{
                  //   width: 200,
                  //   height: 140,
                  // }}
                  offset={[0, 0]}
                /> : <div />}

            </Map>
          </div>
        </Content>
      </Layout>
    );
  }
}
