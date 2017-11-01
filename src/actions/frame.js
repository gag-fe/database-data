export const FRAME_CHART = 'FRAME_CHART';
export const FRAME_LIST = 'FRAME_LIST';
export const SHOP_CHART = 'SHOP_CHART';
import Cookies from 'js-cookie';
import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Store from 'store2';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;
const Login = Utils.common.login;
const API = {
  FRAME_CHART: APP_CONFIG.api.URLFIX + "/saleHourAnalysis.json",
  //FRAME_CHART: "http://192.168.150.222:6899/saleHourAnalysis.json",
  FRAME_LIST: APP_CONFIG.api.URLFIX + "/shopList.json",
  SHOP_CHART: APP_CONFIG.api.URLFIX + "/getShopSaleHourAnalysis.json",
  //SHOP_CHART: "http://192.168.150.222:6899/getShopSaleHourAnalysis.json",
};

// 全局警告提醒
function openNotificationWithIcon(type, title, content) {
  return function () {
    Notification[type]({
      message: title,
      description: content,
      duration: 8,
    });
  };
}
function chartEnd(state) {
  return {
    type: FRAME_CHART,
    ...state
  }
}
function listStart(state) {
  return {
    type: FRAME_CHART,
    ...state
  }
}
function listEnd(state) {
  return {
    type: FRAME_CHART,
    ...state
  }
}
function shopChartEnd(state) {
  return {
    type: FRAME_CHART,
    ...state
  }
}
//热力图
function chartData(initData) {
  return (dispatch, getState) => {
    //dispatch(fetchStart(Object.assign({},getState().site,{loading:true})));
    dispatch(function(){
      Ajax({
          url: API.FRAME_CHART,
          data: initData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              frameData: data,
            };
            const state = Object.assign({},getState().frame,temp);
            dispatch(chartEnd(state, {type:FRAME_CHART}))
          }else {

          }
        })
    });
  }
}
//列表
function listData(listData) {
  return (dispatch, getState) => {
    dispatch(listStart(Object.assign({},getState().frame,{frameLoading:true})));
    dispatch(function(){
      Ajax({
          url: API.FRAME_LIST,
          data: listData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              frameListData: data,
              frameLoading:false
            };
            const state = Object.assign({},getState().frame,temp);
            dispatch(listEnd(state, {type:FRAME_LIST}))
          }else {

          }
        })
    });
  }
}
function shopChartData(shopChartData) {
  return (dispatch, getState) => {
    //dispatch(fetchStart(Object.assign({},getState().site,{loading:true})));
    dispatch(function(){
      Ajax({
          url: API.SHOP_CHART,
          data: shopChartData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              shopChartData: data,
            };
            const state = Object.assign({},getState().frame,temp);
            dispatch(listEnd(state, {type:SHOP_CHART}))
          }else {

          }
        })
    });
  }
}

export default {
  shopChartData,
  listData,
  chartData
}
