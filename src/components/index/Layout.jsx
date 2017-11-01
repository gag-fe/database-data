import React from 'react';
import { bindActionCreators } from 'redux';
import { Provider, connect, Router, Route, hashHistory } from 'react-redux';
import Breadcrumb from '@gag/breadcrumb-web';
import Layout from '@gag/layout-web';
import Icon from '@gag/icon-web';
import Menu from '@gag/menu-web';
import Dropdown from '@gag/dropdown-web';
import Row from '@gag/row-web';
import Col from '@gag/col-web';

import PropTypes from 'prop-types';
import * as LayoutActions from '../../actions/index.js';
import Utils from '../../utils/index';
import BrowserUpgrade from '../browserUpgrade/index';
import Store from 'Store2';
import style from "./Layout.css";
const Ajax = Utils.ajax;
const { Header, Content, Footer, Sider } = Layout;

// components
import HeaderRoot from './header/Header';
import FooterRoot from './footer/Footer';
import Navi from './Navi';
//system-notice
import SystemNotice from '@gag/system-notice';
import VelocityTransitionGroup from './VelocityTransitionGroup.jsx'
class IndexLayout extends React.Component {

  defaultOpenKeys = this.getDefaultOpenKeys();

  state = {
    collapsed: false,
    mode: 'inline',
    defaultOpenKeys: this.defaultOpenKeys
  };

  toggle = () => {
    let collapsed = !this.state.collapsed;
    let defaultOpenKeys = this.defaultOpenKeys;
    let mode = 'inline';

    if(collapsed){
      defaultOpenKeys = [];
      mode = 'vertical';
    }else{
      defaultOpenKeys = this.defaultOpenKeys;
      mode = 'inline';
    }

    this.setState({
      collapsed: collapsed,
      mode: mode,
      defaultOpenKeys: defaultOpenKeys,
    });
  };

  getChild = () => {
    return this.props.children || React.createElement(this.props.route.indexComponent.component);
  }

  getDefaultOpenKeys(){
    let defaultOpenKeys = [];
    this.props.route.menus.map(item =>{
      defaultOpenKeys.push(item.key);
    });
    return defaultOpenKeys || [];
  }

  componentWillMount(){
    this.props.getInitList();
    this.props.getOrgList();
  }

  componentWillReceiveProps(nextProps){

  }

  logout(ev, url){
    ev.nativeEvent.stopImmediatePropagation();
    let tokent = Store.get('token');

    if(!tokent){
      window.location.href = 'https://passport'+ this.props.route.domain +'/index.html?service=' + this.props.route.href;
    }

    Ajax({
      url: url,
      data: { action: 'logout', token: tokent},
      type: 'json',
      method: 'post'
    }).then(resp => {
      Store.clear();
      window.location.href = 'https://passport'+ this.props.route.domain +'/index.html?service=' + this.props.route.href;
    });
  }

  render() {
    const exitMenus = [];
    const routes = this.props.routes;
    const pathname = this.props.location.pathname != '/' ? this.props.location.pathname : '/' + this.props.route.indexComponent.key;
    const pathnameArr = pathname.split('/');
    const currentPathname = pathnameArr.slice(pathnameArr.length -1);
    const props = Object.assign({}, this.props, this.props.layout, {currentPathname: currentPathname}, this.state);

    let layoutClassName = "header-vertical";
    if(props.mode == 'horizontal'){
      layoutClassName = "header-horizontal";
    }else if(props.mode == 'inline') {
      layoutClassName = "header-horizontal-inline";
    }

    let  pageName = routes[routes.length -1]? routes[routes.length -1].breadcrumbName : '';

    if(props.exitMenus){
      props.exitMenus.map(item => {
        if(item.key == 'exit'){
          exitMenus.push(<Menu.Item key={item.key}>{<span>{item.icon}<a onClick={(ev) => this.logout(ev,item.url)} target="_self" title={item.title}> {item.title}</a></span>}</Menu.Item>);
        }else {
          exitMenus.push(<Menu.Item key={item.key}>{<span>{item.icon}<a href={item.url} target="_self" title={item.title}> {item.title}</a></span>}</Menu.Item>);
        }
      })
    }

    const exitList = (
      <Menu>
        {exitMenus}
      </Menu>
    );

    return(<div>
        <SystemNotice entryId="07"></SystemNotice>
      <Layout className={layoutClassName}>
        <Sider width="240"
               trigger={null}
               collapsible
               collapsed={this.state.collapsed}
        >
            <HeaderRoot.Logo {...props} />
            <div className="navi-wrapper">
              <div className="navi-inner-wrapper">
                <Navi {...props}/>
              </div>
            </div>
        </Sider>
        <Layout>
          <Header style={{margin:0, padding:0 }}>
              <header className="row header">
                <Row span={24} gutter={10}>
                  <Col span={8}>

                  </Col>
                  <Col span={8}>

                  </Col>
                  <Col span={8}>

                  </Col>
                </Row>
                <div className="toolbox">
                  <div className="top-navi-left">
                    <div className="button-icon">
                    <Icon
                      className="trigger"
                      type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.toggle}
                    />
                    </div>
                  </div>
                  <div className="button-exit">
                    <Dropdown overlay={exitList}>
                      <a className="ant-dropdown-link" href="#">
                      {props.userName || ''} <Icon type="down" />
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </header>
              <div className="breadcrumb-wrapper">
                <h2 className="page-title">{pageName}</h2>
                <div className="breadcrumb">
                <Breadcrumb routes={this.props.routes} />
                </div>
              </div>
          </Header>
          <Content  style={{ margin: '40px 0 0 0', padding: '20px 50px 0', background: '#F5F5F5' }}>
            <VelocityTransitionGroup transitionName="slide-forward">
            <div id="app-cnt" className="app-cnt">
              {this.getChild()}
            </div>
            </VelocityTransitionGroup>
            <BrowserUpgrade/>
          </Content>
          <FooterRoot {...props} />
        </Layout>
      </Layout>
      </div>
    );
  }
};

IndexLayout.contextTypes = {
  store: PropTypes.object,
};

//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    layout: Object.assign({}, props.route, state.layout)
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(LayoutActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(IndexLayout)
