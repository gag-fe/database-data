import fetch from 'isomorphic-fetch';
export const PRICE_FIN = 'PRICE_FIN';
export const PRICE_BUTE = 'PRICE_BUTE';
export const PRICE_TOTAL = 'PRICE_TOTAL';

import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;

const API = {
  SHOPLIST: APP_CONFIG.api.URLFIX + "/shopList.json",
  PRICEBUTE: APP_CONFIG.api.URLFIX + "/price/distribution.json",
  SHOPTOTAL: APP_CONFIG.api.URLFIX + "/shopEntityList.json",
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

function fetchStart(state) {
  return {
    type: PRICE_FIN,
    ...state
  }
}

function fetchEnd(state) {
  return {
    type: PRICE_FIN,
    ...state
  }
}
function buteEnd(state) {
  return {
    type: PRICE_BUTE,
    ...state
  }
}
function totalEnd(state) {
  return {
    type: PRICE_TOTAL,
    ...state
  }
}
//店铺列表
function totalData(totalData) {
  return (dispatch, getState) => {

    dispatch(function(){
      Ajax({
          url: API.SHOPTOTAL,
          data: totalData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              totalList: data,

            };
            const state = Object.assign({},getState().price,temp);
            dispatch(fetchEnd(state, {type:PRICE_FIN}))
          }else {

          }
        })
    });
  }
}
function initDataPrice(initData) {
  return (dispatch, getState) => {
    dispatch(fetchStart(Object.assign({},getState().price,{priceLoading:true})));
    dispatch(function(){
      Ajax({
          url: API.SHOPLIST,
          data: initData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              tableList: data,
              priceLoading:false
            };
            const state = Object.assign({},getState().price,temp);
            dispatch(fetchEnd(state, {type:PRICE_FIN}))
          }else {

          }
        })
    });
  }
}
//价格分布
export function buteData(buteData) {
  return (dispatch, getState) => {
    //dispatch(fetchStart(Object.assign({},getState().site,{loading:true})));
    dispatch(function(){
      Ajax({
        url: API.PRICEBUTE,
        data: buteData,
        type: 'json',
        method: 'post',
      }).then(resp => {
        if (resp.status == 'S') {
          const data = resp.data.data;
          const temp = {
            buteList:data,
          };
          const state = Object.assign({},getState().price,temp);
          dispatch(buteEnd(state, {type:PRICE_BUTE}))
        }
      }).catch(err => {
        Permission(err);
      });
    });
  }
}

export default {
  buteData,
  initDataPrice,
  totalData
}
