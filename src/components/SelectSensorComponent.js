import React from 'react';
import { Layout, Button, Table } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import fetch from 'dva/fetch';
import history from '../services/history';
import { routerRedux } from 'dva/router';

const { Sider, Content } = Layout;
const { Column } = Table;

export class SelectSensorComponent extends React.Component {
  state = {
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

  constructor() {
    super();
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
      this.setState({
        sensors: data,
      });
    }).catch((error) => {
      throw error;
    });
  }


  onSelectChange = (selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      const key = parseInt(selectedRowKeys[selectedRowKeys.length - 1]);
      this.setState({
        selectedRowKeys,
        center: { longitude: this.state.sensors[key].lon, latitude: this.state.sensors[key].lat },
      });
    } else {
      this.setState({ selectedRowKeys });
    }
  }
  // 上传选中的传感器ID
  onClickFinish = () => {
    if (this.state.selectedRowKeys.length == 0) { alert('请先选择传感器，再完成数据集'); return; }
    // let s = '';
    const sensorIds = new Array();
    for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
      const key = parseInt(this.state.selectedRowKeys[i]);
      sensorIds.push(this.state.sensors[key].sensorID);
      // if (i == this.state.selectedRowKeys.length - 1) { s = `${s}sensorIDs=${this.state.sensors[key].sensorID}`; } else { s = `${s}sensorIDs=${this.state.sensors[key].sensorID}&`; }
    }
    // const formData = new FormData();
    // formData.append('sensorIDs', sensorIds);
    fetch('http://www.myflood.com/getSelectSensorsJson', { method: 'POST',
      credentials: 'include',
      headers:
      { Accept: 'application/json',
        // 'Access-Control-Allow-Origin': 'http://127.0.0.1',
        // 'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(sensorIds) }).then((response) => {
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
      data ? window.location.href = '/subscribe' : alert('数据集选取错误！');
    }).catch((error) => {
      throw error;
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Layout>
        <Sider
          trigger={null}
          width={200}
          style={{ backgroundColor: 'white' }}
        >
          <Table
            dataSource={this.state.sensors} pagination={{ defaultPageSize: 6 }} rowSelection={rowSelection}
            onRow={(record, index) => {
              alert(index);
            }}
          >
            <Column
              title="传感器名称"
              dataIndex="sensorName"
              key="sensorName"
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
        <Content style={{ minHeight: 410 }}>
          <div style={{ height: '410px', width: '100%' }}>
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
