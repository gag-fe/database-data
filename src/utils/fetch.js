import qwest from 'qwest';
import Notification from '@gag/notification-web';
import Modal from '@gag/modal-web';
import utils from './common.js';
import Auth from '../components/authorize/Auth';
import Cookies from 'js-cookie';
import React from 'react';
var isSetTimeout;
var isShowConfirm = false; //confirm 是否展示过

const showError = function (msg) {
  Notification.error({
    message: '错误',
    duration: 10,
    description: msg,
  });

  if(DEV_STATE == 0 || DEV_STATE == 1){
    if(isSetTimeout){
      clearTimeout(isSetTimeout);
    }else{
      isSetTimeout = setTimeout(function(){
        //window.location.reload();
      },10000);
    }
  }
};

const notice = {
  INVOKE_ERROR: '调用后台接口出错，请联系应用产品负责人!',
  AUTH_FAIL: '亲，您没有权限，请申请权限!',
};

const confirm = function () {
  var title = title || '警告';
  var content = content || '登陆超时或没有权限，请联系应用产品负责人！';
  isShowConfirm = true;
  Modal.confirm({
    title: title,
    content: content,
    okText: '确认',
    onOk: () => {
      goLogin();
    },
    onCancel: () =>{
      isShowConfirm = false;
    }
  });
};

const confirm2 = function (title, content) {
  var title = title || '警告';
  var content = content || '登陆超时或没有权限，请联系应用产品负责人！';
  Modal.confirm({
    title: title,
    content: content,
    okText: '确认'
  });
};

const adapter = function (data) {
  return data;
};

const token = function () {
  const key = 'com.gooagoo.passpart.sso.token.name';
  return Cookies.get(key);
};

const goLogin = function(back) {
  //let target = window.location.hash.replace(/^\#\//, '').replace(/\//g, '|');
  //Cookies.remove('token');
  //showError('未登录或登录超时');
  // return (target.indexOf('login')<0 ? hashHistory.push('login/'+target) : true);
  //if (target.indexOf('login') < 0) {
    return window.location.href = APP_CONFIG.api.LOGIN;
  //}
};

const defaultOptions = {
  method: 'post',
  data: {
    sso_token: '',
    token: ''
  },
  type: 'json',
  adapter, // resultDTO解析方法
  alertError: true, // 是否弹出错误提示窗口
  alertDenyAccess: true, // 是否弹出没有权限提示窗口
  parallel: false, // 是否并行发送批量请求
  withCredentials: true, //设置跨域请求Cookies
  isSuccess(xhr, resp) { // 自定义逻辑判断是否成功
    if(resp.status === 'S' || resp.success === true || resp.status === 'success' || resp.status === 'OK'){
      return true;
    }else{
      return false;
    }
  },
  isAccessDeny(xhr, resp) { // 判断是否没有权限
    return resp.statusCode == '403' || resp.status === 'T' || resp.status === 'timeout' || resp.status === '';
  },
  getAuthUrl(xhr, resp) { // 获取授权url
    return APP_CONFIG.api.LOGIN;
  },
};

const fetchMany = function (options) {
  let { url, method } = options;
  let temp = qwest;
  url.forEach(u => {
    temp = temp[method](u);
  });
  return new Promise((resolve, reject) => {
    temp.then(ans => {
      ans.forEach(item => {
        let xhr = item[0],
          response = item[1];
        if (typeof response == 'string' && (options.type === 'json' || options.type === 'jsonp')) {
          response = JSON.parse(response);
        }
        response = options.adapter(response);

        if (!options.isSuccess(xhr, response)) {

          if(response.data){
            if(response.data['errorCode'] != 0){
              confirm2('警告', response.data.message);
            }
          }

          reject(ans, item);
        }
      });
      resolve(ans);
    }).catch((e, xhr, resp) => {
      options.alertError && showError(resp.msg);
      reject({
        xhr,
        resp,
      });
    });
  });
};

const Fetch = function (options) {

  let tokenTemp = token();
  let urlTemp = {
    url: options.url
  };

  if(options.method){
    if(options.method.toLowerCase() === 'post'){
      if(options.url.indexOf('?') == -1){
        urlTemp['url'] = options.url + '?sso_token=' + tokenTemp + '&token=' + tokenTemp;
      }else {
        urlTemp['url'] = options.url + '&sso_token=' + tokenTemp + '&token=' + tokenTemp;
      }
    }
  }else {
    if(options.url.indexOf('?') == -1){
      urlTemp['url'] = options.url + '?sso_token=' + tokenTemp + '&token=' + tokenTemp;
    }else {
      urlTemp['url'] = options.url + '&sso_token=' + tokenTemp + '&token=' + tokenTemp;
    }
  }

  options.data['sso_token'] = tokenTemp;
  options.data['token'] = tokenTemp;
  options = Object.assign({}, defaultOptions, options, urlTemp);

  //支持后端JSON
  if(options.contentType && options.contentType != ''){
    qwest.setDefaultOptions({
      headers:{
        'Content-Type': options.contentType
      }
    });
  }else {
    qwest.setDefaultOptions({
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  }



  let { parallel = false } = options;
    // 并行的请求
  if (parallel) {
    return fetchMany(options);
  }

  return new Promise((resolve, reject) => {
    qwest[options.method](options.url, options.data, options).then((xhr, resp) => {
      if (typeof resp == 'string' && (options.type === 'json' || options.type === 'jsonp')) {
        resp = JSON.parse(resp);
      }
      resp = options.adapter(resp);
      if (options.isSuccess(xhr, resp)) {
        if(options.url.indexOf('simulate_parse.json') == 1){
          debugger;
        }

          if(resp.data && resp.data.errorCode != 0 && resp.data.message){
            showError(resp.data.message);
          }
          resolve(resp);
      } else {
        resolve(resp);//增加失败透传
        const errorMsg = resp.msg || notice.INVOKE_ERROR;
        let accessDeny = false,
          authUrl = '';
        if (options.isAccessDeny(xhr, resp)) { // 没有权限
          authUrl = options.getAuthUrl(xhr, resp);
          accessDeny = true;
          if (options.alertDenyAccess && !isShowConfirm) {
            confirm();
          }
        } else {
          options.alertError && showError(errorMsg);
        }
        reject({
          accessDeny,
          authUrl,
          resp,
          xhr,
        });
      }
    }).catch((e, xhr, resp) => {
      options.alertError && showError(resp.msg);
      reject({
        xhr,
        resp,
      });
    });
  });
};

module.exports = Fetch;
