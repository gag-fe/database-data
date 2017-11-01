export const GET_INIT = 'GET_INIT';
import Cookies from 'js-cookie';
import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Store from 'store2';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;
const Login = Utils.common.login;
const API = {
  INIT: APP_CONFIG.api.URLFIX + "/init.json",
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
    type: GET_INIT,
    ...state
  }
}

function fetchEnd(state) {
  return {
    type: GET_INIT,
    ...state
  }
}

// 获取初始机构列表 feach

function getInitList () {
  let locationShopId = '';

  if(Store.get('user_data') && Store.get('user_data').shopId){
    locationShopId = Store.get('user_data').shopId || '';
  }

  let posData = {
    init: 'init',
    shopId: locationShopId
  };

  return (dispatch, getState) => {
    //dispatch(fetchStart(Object.assign({},getState().org,{loading:true})));
    dispatch(function(){
      Ajax({
          url: API.INIT,
          data: posData,
          type: 'json',
          method: 'post'
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const funcAuthoritiesObj = {};
            data.funcAuthorities.map(item => {
              funcAuthoritiesObj[item.id] = item;
            });
            const state = Object.assign({}, getState().layout, data, {funcAuthoritiesObj:funcAuthoritiesObj}, {loading: false});

            Store.set('orgType', data.orgType);
            Store.set('now_username', data.userName);
            Store.set('now_shopid', data.now_shopid);
            Store.set('user_data', data);

            window.APP_CONFIG = Object.assign(window.APP_CONFIG, data);
            dispatch(fetchEnd(state, {type: GET_INIT}));
          }else {
            Login();
          }
        }).catch(err => {
          console.log(err);
        });
    });
  }
};

export default {
  getInitList
}
