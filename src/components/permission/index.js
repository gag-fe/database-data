
import React from 'react';
import notifyFactory from '../notifyFactory/index';

class AuthUrl extends React.Component {
  constructor(opt) {
    super(opt);
  }
  render() {
    const { url, msg} = this.props;
    return (<div>
      <p>{msg}</p>
      <p>{url}</p>
      </div>
    );
  }
}

export default function permission(data) {
  if (data && data.accessDeny) {
    const url = data.xhr.responseURL;
    const msg = data.resp.msg;
    const urlComp = <AuthUrl url={url} msg={msg} />;
    var title;
    if(data.resp.status == 'T' || data.status == 'T'){
      title = "登陆超时";
    }else if (data.resp.status == 'F' || data.status == 'S') {
      title = "调用接口失败";
    }else{
      title = "异常";
    }
    notifyFactory('error', title, urlComp)();
  }else {
    const urlComp = <AuthUrl url="" msg={data.toString()} />;
    notifyFactory('error', '异常', urlComp)();
  }
}
