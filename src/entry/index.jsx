import '../common/lib';
import Index from '../components/index/Index';
import ReactDOM from 'react-dom';
import React from 'react';
import Store from 'Store2';
import Cookies from 'js-cookie';
import Icon from '@gag/icon-web';
import './index.less';
import Utils from '../utils/index';

if(!window.APP_CONFIG){
  window.APP_CONFIG = {};
}

window.APP_CONFIG['token'] = Cookies.get('com.gooagoo.passpart.sso.token.name');

if(Store.get('tokent') != window.APP_CONFIG.token){
  Store.clear();
}

Store.set('tokent', window.APP_CONFIG.token);

ReactDOM.render(<Index/>, document.getElementById('react-content'));
