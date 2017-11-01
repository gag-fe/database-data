import React from 'react';
import { Provider } from 'react-redux';
import { connect, Router, Route, hashHistory } from 'react-router';
import Icon from '@gag/icon-web';
import Store from 'Store2';

//redux
import configureStore from '../configureStore/index';
import preloadedState from '../configureStore/initialStore';
const store = configureStore(preloadedState);

// components
import Menus from '../../config/menus';
//价格分布
import PriceDistribute from '../../modules/operate/price-distribute/index';
import IndexLayout from './Layout';
// errors
import Error404 from '../error/404';


class IndexRoute extends React.Component {
  getPathKey(k) {
    //return k + this.props.suffix;
    return k;
  }

  generateMenuRouter(menus, path) {
    const routes = [];
    menus = menus || this.props.menus;
    path = path || '';
    menus.forEach((item) => {

      var href;

      if(item.hash && item.hash != ''){
        href = item.key.length ? (`${path}/${item.key}/${item.hash}`) : path + item.hash;
      }else {
        href = item.key.length ? (`${path}/${item.key}`) : path;
      }

      const _path = item.component ? this.getPathKey(href) : href;

      if (item.children && item.children.length > 0) {
        routes.push(
          <Route key={item.key} breadcrumbName={item.title} path={_path} component={item.component}>
            {this.generateMenuRouter(item.children, href)}
          </Route>
        );
      } else {
        routes.push(
          <Route key={item.key} breadcrumbName={item.title} path={_path} component={item.component}/>
        );
      }
    });
    return routes;
  }

  componentWillReceiveProps(nextProps){
    //console.log(nextProps,'index');
  }

  render() {
    return (
      <Provider store={store} key="provider">
          <Router history={hashHistory}>
              <Route path="/" component={IndexLayout} breadcrumbName="" {...this.props}>
                  {this.generateMenuRouter()}
                  <Route path="*" component={Error404} />
              </Route>
          </Router>
      </Provider>
    );
  }
}

IndexRoute.defaultProps = {
  menus: Menus,
  theme: 'dark',
  funcAuthoritiesObj: {},
  exitMenus:[{
    key: 'exit',
    title: '退出登录',
    icon: <Icon type="poweroff" />,
    url:'https://passport'+ window.Domain +'/logout.do?token=' + APP_CONFIG.token
  }],

  domain: window.Domain,
  suffix: '.html',
  mode: 'inline', //horizontal 水平菜单，vertical 垂直菜单, inline内嵌
  indexComponent: {
    component: PriceDistribute,
    key: 'priceDistribute'
  },
  userName: Store.get('user_data')? Store.get('user_data').userName : '',
  shopId: Store.get('user_data')? Store.get('user_data').shopId : '',
  shopName: Store.get('user_data')? Store.get('user_data').shopName : '',
  token:'',
  name: '数据图谱',
  href: window.location.origin + '/',
  footer: 'Copyright @2017 gooagoo.com. All rights reserved. '
};
IndexRoute.contextTypes = {
  store: React.PropTypes.object
};

module.exports = IndexRoute;
