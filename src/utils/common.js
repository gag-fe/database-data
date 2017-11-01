import Cookies from 'js-cookie';
import Modal from '@gag/modal-web';
const Utils = {
  merge() {
    const ret = {};
    const args = [].slice.call(arguments, 0);
    args.forEach((a) => {
      Object.keys(a).forEach((k) => {
        ret[k] = a[k];
      });
    });
    return ret;
  },

  getToken () {
    const key = 'com.gooagoo.passpart.sso.token.name';
    return Cookies.get(key);
  },

  login(param) {
    Cookies.remove('user_data', {path: '/'});
    Cookies.remove('com.gooagoo.passpart.sso.token.name', {path: '/', domain: window.Domain});
    if (param == 'out') {
      window.location.href = `https://passport.test.goago.cn/index.html`;
    } else {
      window.location.href = `https://passport.test.goago.cn/index.html?service=${window.location.host}`;
    }
  },

  //字符串截取
  cutstr(str, len, str2) {
    var temp,
      icount = 0,
      patrn = /[^\x00-\xff]/,
      strre = "";
    for (var i = 0; i < str.length; i++) {
      if (icount < len - 1) {
        temp = str.substr(i, 1);
        if (patrn.exec(temp) == null) {
          icount = icount + 1;
        } else {
          icount = icount + 2;
        }
        strre += temp;
      } else {
        break;
      }
    }

    if(!str2 || str2 == ''){
      str2 = "...";
    }
    return strre + str2;
  },

  //判断对象是否为空
  isEmptyObject(obj){
    for (var key in obj) {
      return false;
    }
    return true;
  },
  //判断是否是Array
  isArray(arr){
    if(typeof arr === 'object' && !isNaN(arr.length)) {
      console.log('参数' + arr , '是数组！');
      return true;
    }else {
      console.log('参数' + arr , '不是数组！');
      return false;
    }
  },

  //通用确认弹窗
  modal(type, title, mag){
    var type = type || 'info';
    var title = title || '';
    var mag = mag || '';
    Modal[type]({
      title: title,
      content: mag,
      okText: '确定'
    });
  },

  //前后去除空格
  trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  //二位小数
  formatCurrency(num) {
    if (0 < num && num < 0.01) {
      num = 0.01;
    }

    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
  },

  //获取地址栏参数的方法
  getRequest(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (window.location.href.indexOf("?") > -1) {
      var r = window.location.href.split("?")[1].substr(0).match(reg);
      if (r !== null) return (r[2]);
      return null;
    } else {
      return null;
    }
  },

  //生产uuid方法
  uuid(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
};

module.exports = Utils;
