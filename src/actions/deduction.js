export const DEDUCTION_FIN = 'DEDUCTION_FIN';
export const DEDUCTION_SET = 'DEDUCTION_SET';
export const EDITOR_VISIBLE = 'EDITOR_VISIBLE';
import Cookies from 'js-cookie';
import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Store from 'store2';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;
const Login = Utils.common.login;
const API = {
  DEDUCTION_LIST: APP_CONFIG.api.URLFIX + "/config/getPaymentRules.json",
  //DEDUCTION_LIST: "http://192.168.150.222:6899/config/getPaymentRules.json",
  DEDUCTION_SET: APP_CONFIG.api.URLFIX + "/config/setPayMethodWeight.json",
  //DEDUCTION_SET: "http://192.168.150.222:6899/config/setPayMethodWeight.json",
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
    type: DEDUCTION_FIN,
    ...state
  }
}

function fetchEnd(state) {
  return {
    type: DEDUCTION_FIN,
    ...state
  }
}

//店铺列表
function initDataDeduction(initData) {
  return (dispatch, getState) => {
    dispatch(fetchStart(Object.assign({},getState().deduction,{deductionLoading:true,editorVisible: false})));
    dispatch(function(){
      Ajax({
          url: API.DEDUCTION_LIST,
          data: initData,
          type: 'json',
          method: 'post',
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const temp = {
              deductionList: data,
              deductionLoading:false
            };
            const state = Object.assign({},getState().deduction,temp);
            dispatch(fetchEnd(state, {type:DEDUCTION_FIN}))
          }else {

          }
        })
    });
  }
}
//设置支付方式抵扣率
function setDeduction(setData) {
  return (dispatch, getState) => {
    dispatch(fetchStart(Object.assign({},getState().deduction,{deductionLoading:true})));
    dispatch(function(){
      Ajax({
          url: API.DEDUCTION_SET,
          data: setData,
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          type: "POST",
        }).then(resp => {
          if (resp.status == 'S') {
            let setState = Object.assign({},getState().deduction,{editorVisible: true});
            dispatch(setState, {type:DEDUCTION_SET});
          }else {

          }
        })
    });
  }
}
//日结单生效弹窗
function editorVisible(item) {
  return (dispatch, getState) => {
    dispatch(function(){
      let setState = Object.assign({}, {editorVisible: item, type: EDITOR_VISIBLE});
      dispatch(setState, {'type': EDITOR_VISIBLE});
    });

  }
}

export default {
  setDeduction,
  editorVisible,
  initDataDeduction
}
