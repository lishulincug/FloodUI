
const noProxy = process.env.NO_PROXY === 'true';
export default noProxy ? {} : delay(proxy, 1000);
// export default {
// 	'GET /api/users':'http://www.myflood.com/api/user',
//   //事件订阅，传感器数据交互的数据结构
//   'GET /event/current':{dataset:{flag:true,sensorList:[{sensorID:'sensor1',propertyID:'property1'},
//     {sensorID:'sensor1',propertyID:'property1'}]},event:{flag:false,eventID:'event1',params:[1,2,3,4]},email:{flag:false,address:'yuansaii@qq.com'}},
//   'GET /homePage':'http://202.114.118.197/homePage',
//   'GET /baidu':'http://www.baidu.com'
// };
