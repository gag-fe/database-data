/*
 * 浏览器升级提示计划
 * @class BrowserUpgrade
 * @author hewenshan@gooagoo.com
 */
import React from 'react';
import Store from 'store2';
import Button from '@gag/button-web';
import Modal from '@gag/modal-web';
import './index.css';
class BrowserUpgrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'debug': false, //开发模式
      'versions': [6, 7, 8, 9, 10], //需要提示的ie版本，默认6、7、8, 9, 10
      'mode': 'top', //提醒模式，string可以指定top或者mask
      'visible': this.setup(),
      'lang': 'zh_cn',
      'title': '浏览器升级提醒',
      'describe': '您使用的浏览器版本过低',
      'upgrade': '建议您立即升级浏览器，您可点击右方图标链接进行升级！',
      'suggestion': '为保障您在Gooagoo.com上的体验，建议您立即升级浏览器！',
      'msInfo': '微软已停止对IE6～10的的安全更新，您的浏览器可能存在安全风险',
      'download': '立即下载'
    };
  }

  hideModal = () => {
    this.setState({
      visible: false
    });
  }

  setup = () => {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    if (isIE){
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);

      if(fIEVersion < 11){
        return true;
      }else{
        return false;
      }
    }
  }

  render() {
    return (
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={this.hideModal}
        onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
      >
        <div className="browser-upgrade">
          <div style={{fontSize: '14px', textAlign: 'center', lineHeight: '20px'}}>{this.state.suggestion}</div>
          <div style={{fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#999'}}>
            <i class="ui2-icon ui2-icon-warning" style={{fontSize: '14px', color: 'red'}}></i>
            &nbsp;{this.state.msInfo}
          </div>
          <div className="dialog-brwosers-wrap">
            <ul>
              <li>
                <div className="dialog-brwoser-detail chrome-icon">
                  <span >Google Chrome</span><br/>
                  <span><a href="//www.google.cn/chrome/browser/desktop/"
                           target="_blank">{this.state.download}</a></span>
                </div>
              </li>
              <li>
                <div className="dialog-brwoser-detail ie11-icon">
                  <span>Internet Explorer 11</span><br/>
                  <span><a href="//www.microsoft.com/zh-cn/download/internet-explorer.aspx"
                           target="_blank">{this.state.download}</a></span>
                </div>
              </li>
              <li>
                <div className="dialog-brwoser-detail firefox-icon">
                  <span >Firefox</span><br/>
                  <span><a href="//www.firefox.com/download/" target="_blank">{this.state.download}</a></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BrowserUpgrade;
