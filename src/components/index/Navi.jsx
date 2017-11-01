import React from 'react';
import { Link } from 'react-router';
import Menu from '@gag/menu-web';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
import Utils from '../../utils/index';
const isEmptyObject = Utils.common.isEmptyObject;
class Navi extends React.Component {

  constructor(props) {
    super(props);

    let pathStr = '';

    if(this.props.routes[1] && this.props.routes[1].path){
      pathStr = this.props.routes[1].path ? this.props.routes[1].path.substring(1,this.props.routes[1].path.length) : '';
    }else {
      pathStr = '';
    }

    let openKeysSubmenuKeys = [];

    if(pathStr && pathStr.length > 0){
      openKeysSubmenuKeys.push(pathStr);
    }else {
      openKeysSubmenuKeys.push(this.props.defaultOpenKeys[0]);
    }

    this.state = {
        current: this.props.currentPathname,
        defaultOpenKeys: openKeysSubmenuKeys || [],
        openKeys: openKeysSubmenuKeys || [],
        mode: this.props.mode || 'inline'
    };
  }

  hasVisibleChildren(menu) {
    let has = false;
    if (menu.children && menu.children.length) {
      // 只要有一个节点的visible不为false，has就为true
      has = !menu.children.every((item) => {
        return item.visible === false;
      });
    }
    return has;
  }

  targetUrl(url, ev){
    ev.nativeEvent.stopImmediatePropagation();
    window.location.href = url;
    //window.history.pushState({},'xx', url);
    //return false;
  }

  generateMenuDom(menus, path) {
    const menuDoms = [];
    menus = menus || this.props.menus;
    path = path || '';

     menus.map((item) => {
      let href = path;
      if(item.targetUrl && item.targetUrl != ''){
        href = item.targetUrl;
      }else {
        href = item.key.length ? (`${path}/${item.key}`) : path;
      }

      const hash = item.key.length ? this.props.suffix : '';
      const toObj = {
        pathname: href
      };

      if (item.visible != false && this.props.funcAuthoritiesObj[item.id] != undefined) {
        if (this.hasVisibleChildren(item)) {
          if(item.icon && item.icon !== ''){
            menuDoms.push(
              <SubMenu key={item.key} title={<span>{item.icon}<span className="nav-text">{item.title}</span></span>}>
                {this.generateMenuDom(item.children, href)}
              </SubMenu>
            );
          }else{
            menuDoms.push(
              <SubMenu key={item.key} title={item.title}>
                {this.generateMenuDom(item.children, href)}
              </SubMenu>
            );
          }
        } else {
            if(item.icon && item.icon !== ''){
              if(item.targetUrl && item.targetUrl != ''){
                menuDoms.push(
                  <Item key={item.key}>
                    {item.icon}
                    <span className="nav-text">
                      <a title={item.title}  onClick={this.targetUrl.bind(this,item.targetUrl)} href="javascript:void(0);" target="_self">{item.title}</a>
                    </span>
                  </Item>
                  );
              }else{
                menuDoms.push(
                  <Item key={item.key}>
                    <span className="nav-text">
                      <Link title={item.title} to={toObj}>{item.title}</Link>
                    </span>
                  </Item>
                  );
              }

            }else{
              if(item.targetUrl && item.targetUrl != ''){
                menuDoms.push(
                  <Item key={item.key}>
                    <a title={item.title}  onClick={this.targetUrl.bind(this,item.targetUrl)} href="javascript:void(0);" target="_self">{item.title}</a>
                  </Item>
                );
              }else{
                menuDoms.push(
                  <Item key={item.key}>
                    <Link title={item.title} to={toObj}>{item.title}</Link>
                  </Item>
                );
              }

            }
        }
      }

    });

    return menuDoms;
  }

  handleClick(e, key){
    let currentArr = [];
    key = e.key;
    currentArr.push(key);
    this.setState({
      current: currentArr
    });
  }

  _onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.props.defaultOpenKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.currentPathname != nextProps.currentPathname || this.props.mode != nextProps.mode){
      window.IS_NEW_PAGE = true;
      window.IS_EVENT = false;

      this.setState({
        current: nextProps.currentPathname,
        mode: nextProps.mode,
        defaultOpenKeys: nextProps.defaultOpenKeys[0]
      });
    }else {
      window.IS_NEW_PAGE = false;
    }

  }

  render() {
    if(isEmptyObject(this.props.funcAuthoritiesObj)){
        return false;
    }
    return (
          <Menu theme={this.props.theme} mode={this.state.mode}
                openKeys={this.state.openKeys}
                onClick={this.handleClick.bind(this)}
                selectedKeys={this.state.current}
                onOpenChange={this._onOpenChange}
          >
              {this.generateMenuDom()}
          </Menu>);
  }
}

module.exports = Navi;
