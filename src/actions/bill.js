import fetch from 'isomorphic-fetch';
export const BILL_FIN = 'BILL_FIN';
export const BILL_PIC = 'BILL_PIC';
export const BILL_EDITOR = 'BILL_EDITOR';
export const BILL_VISIBLE = 'BILL_VISIBLE';

import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;
const API = {
  SHOPBILL: APP_CONFIG.api.URLFIX + "/config/getDailyStatementRules.json",
  PICBILL: APP_CONFIG.api.URLFIX +"/config/getDailyStatementPic.json",
  EDITOR: APP_CONFIG.api.URLFIX +"/config/setDailyStatementRule.json",
};

// 获取初始店铺列表
function fetchStart(state) {
  return {
    type: BILL_FIN,
    ...state
  }
}
function fetchEnd(state) {
  return {
    type: BILL_FIN,
    ...state
  }
}
function editorEnd(state) {
  return {
    type: BILL_EDITOR,
    ...state
  }
}
function picEnd(state) {
  return {
    type: BILL_PIC,
    ...state
  }
}

function initData(billData) {
  return (dispatch, getState) => {
    dispatch(fetchStart(Object.assign({},getState().bill,{billLoading:true,billVisible: false})));
    //dispatch(fetchUpData);
    dispatch(function(){
      Ajax({
          url: API.SHOPBILL,
          data: billData,
          type: 'json',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              tableList:data,
              billLoading:false
            };
            const state = Object.assign({},getState().bill,temp);
            dispatch(fetchEnd(state, {type:BILL_FIN}));
          }else {
          }
        });
    });
  }
}
function picData(billData) {
  return (dispatch, getState) => {
    //dispatch(fetchStart(Object.assign({},getState().site,{loading:true})));
    //dispatch(fetchUpData);
    dispatch(function(){
      Ajax({
          url: API.PICBILL,
          data: billData,
          type: 'json',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              picList:data,
            };
            const state = Object.assign({},getState().bill,temp);
            dispatch(picEnd(state, {type:BILL_PIC}));
          }else {
          }
        }).catch(err => {
          Permission(err);
        });
    });

  }
}

function editorData(billData) {
  return (dispatch, getState) => {
    //dispatch(fetchUpData);
    dispatch(fetchStart(Object.assign({},getState().bill,{billLoading:true})));
    dispatch(function(){
      Ajax({
          url: API.EDITOR,
          data: billData,
          dataType: "json",
          contentType: "application/json",
          type: "POST",
        }).then(resp => {
          if (resp.status == 'S') {
            let setState = Object.assign({},getState().bill,{billVisible: true});
            dispatch(setState, {type:BILL_EDITOR});
          }else {

          }
        });
    });

  }
}
//日结单生效弹窗
function editorVisible(item) {
  return (dispatch, getState) => {
    dispatch(function(){
      let setState = Object.assign({}, {billVisible: item, type: BILL_VISIBLE});
      dispatch(setState, {'type': BILL_VISIBLE});
    });

  }
}

export default {
  editorVisible,
  editorData,
  picData,
  initData
}
