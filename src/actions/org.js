export const GET_ORG = 'GET_ORG';
export const UPDATA_ORG = 'UPDATA_ORG';
export const SET_INIT_ORG = 'SET_INIT_ORG';
import Notification from '@gag/notification-web';
import Store from 'store2';
import Utils from '../utils/index';
import Cookies from 'js-cookie';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;

const API = {
  INIT: APP_CONFIG.api.URLFIX + "/init.json",
  GETORGLIST: APP_CONFIG.api.URLFIX + "/shops.json",
};

const haveNochild=(arr,value)=>{
    if(!value.children){
        return value;
    }
    for (var i=0; i<arr.length; i++) {
            if(arr[i].parentId==value.id){
            var lt=arr[i];
                lt.children=[];
                value.children.push(lt);
                arr.splice(i--,1);
                }
            }
    return haveChild(arr,value.children);

}
const haveChild=(arr,TotalArr)=>{
    if (TotalArr instanceof Array&&TotalArr.length) {
     for(var i=0;i<TotalArr.length;i++){
        haveNochild(arr,TotalArr[i]);
    }
    }else{
        return TotalArr;
    }
}

const deepCopy=(p, c)=>{
　　　　var c = c || {};
　　　　for (var i in p) {
　　　　　　if (typeof p[i] === 'object') {
　　　　　　　　c[i] = (p[i] instanceof Array) ? [] : {};
　　　　　　　　deepCopy(p[i], c[i]);
　　　　　　} else {
　　　　　　　　　c[i] = p[i];
　　　　　　}
　　　　}
　　　　return c;
　　}

const pick=(arr)=>{
        var list=[];
        for (var i=0; i<arr.length; i++) {
            if(arr[i].parentId==-1){
            var tt=deepCopy(arr[i]);
                    tt.children=[];
                list.push(tt);
                arr.splice(i--,1);
            }
        };
        haveChild(arr,list);
        return list;
}

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
    type: GET_ORG,
    ...state
  }
}

function fetchEnd(state) {
  return {
    type: GET_ORG,
    ...state
  }
}

function updata(state) {
  //setOrgInit(state);
  return {
    type: UPDATA_ORG,
    ...state
  }
}

function setUpdataState(state) {
  return {
    type: SET_INIT_ORG,
    ...state
  }
}

// 新的机构信息同步给init的初始化服务 fetch

function setOrgInit(state) {

    Ajax({
      url: API.INIT,
      data: Object.assign({action: 'setOrgInit'}, state),
      type: 'json',
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
      }
    });
}

// 获取初始机构列表 fetch

function getOrgList () {
  return (dispatch, getState) => {
    dispatch(function(){
      Ajax({
          url: API.GETORGLIST,
          data: { action: 'getOrgList'},
          type: 'json',
          method: 'post'
        }).then(resp => {
          if (resp.status == 'S') {
            const data = resp.data;
            const store = getState();
            const userData = {};
                  userData['shopId'] = store.org.shopId || store.layout.shopId;
                  userData['shopName'] = store.org.shopName || store.layout.shopName;
                  userData['orgType'] = store.layout.orgType;

            let   orgList = pick(data);
            const state = Object.assign({}, userData, {'orgList': orgList, loading:false});
            dispatch(fetchEnd(state, {type: GET_ORG}));
          }
        });
    });
  }
}


//更新Store的 机构信息
function updataOrg (state) {
  return (dispatch, getState) => {
    dispatch(updata(state, {type: UPDATA_ORG}));
  }
}

//更新Store的 机构信息 fetch

function setUpdataOrg (state) {
    return (dispatch, getState) => {
      dispatch(function(){
        Ajax({
          url: API.INIT,
          data: Object.assign({action: 'setOrgInit'}, state),
          type: 'json',
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

          }
        });
      });
      dispatch(setUpdataState(state, {type: SET_INIT_ORG}));
    }
};

export default {
  getOrgList,
  setUpdataOrg,
  updataOrg
}
