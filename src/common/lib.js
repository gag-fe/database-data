import '@gag/style-web/index.less';
import './style/index.less';
import Cookies from 'js-cookie';
import Modal from '@gag/modal-web';
import Store from 'store2';

if(!APP_CONFIG){
  window.APP_CONFIG = {};
}

window.DEV_STATE = 0; //域名判断状态
window.IS_NEW_PAGE = false;//路由变更
window.IS_EVENT = false;//留有

var isShowConfirm = false; //confirm 是否展示过
var hostName = 'dashboard';
(function(strUrl){
  const RGE_TEST = new RegExp('test');
  const RGE_DEV = new RegExp('dev');
  const RGE_LOCALHOST = new RegExp('localhost');
  const RGE_LOCALHOST2 = new RegExp('127.0.0.1');

  if(RGE_TEST.test(strUrl)){
    DEV_STATE = 1;
    window.Domain = ".test.goago.cn";
    hostName = 'data';
  }else if(RGE_LOCALHOST.test(strUrl) || RGE_LOCALHOST2.test(strUrl)) {
    DEV_STATE = 2;
    window.Domain = ".test.goago.cn";
    hostName = 'data';
  }else{
    DEV_STATE = 0;
    window.Domain = ".gooagoo.com";
    //window.Domain = ".before.gooagoo.com"
    hostName = 'dashboard';
  }

})(window.location.origin);

const CURRNET_URL= window.location.href;
const LOGIN_URL_TEST = "https://passport.test.goago.cn/index.html?service=";
const LOGIN_URL_PRO = "https://passport.gooagoo.com/index.html?service=";

window.APP_CONFIG['api'] = {
  SHOPLIST: "http://"+ hostName + window.Domain,
  URLFIX: "http://"+ hostName + window.Domain,
  YUQING:"http://yqmonitordb.test.goago.cn/bs",
  LOGIN: DEV_STATE ? LOGIN_URL_TEST + CURRNET_URL : LOGIN_URL_PRO + CURRNET_URL
};

const confirm = function () {
  isShowConfirm = true;
  Modal.confirm({
    title: '警告',
    content: '登陆超时或没有权限，请联系应用产品负责人！',
    okText: '确认',
    onOk: () => {
      window.location.href = APP_CONFIG.api.LOGIN;
    },
    onCancel: () =>{
      isShowConfirm = false;
    }
  });
};

if(APP_CONFIG.status == 'T' || APP_CONFIG.status == 'F'){
  confirm();
}else{
  APP_CONFIG.token = APP_CONFIG.token ? APP_CONFIG.token: Cookies.get('com.gooagoo.passpart.sso.token.name') || 'undefined';
}
