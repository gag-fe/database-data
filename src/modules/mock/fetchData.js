import message from '@gag/message-web';
import notification from '@gag/notification-web';
import Utils from '../../utils/index';
import Moment from 'moment';
import Permission from '../../components/permission/index';
const ajax = Utils.ajax,
  commonUtils = Utils.common;
const formatter = 'YYYY-MM-DD';

const API = {
  ajax: 'http://127.0.0.1:8989/x.do',
  jsonp: 'http://127.0.0.1:8989/y.do',
  apge: 'http://127.0.0.1:8989/z.do'
};

const fetchData = {
  ajaxRequest() {
    ajax({
      url: API.ajax,
      data: {},
      method: 'get',
    }).then(resp => {
      console.log(resp);
    }).catch(err => {
      Permission(err);
    });
  },
  // 全局警告提醒
  openNotificationWithIcon(type, title, content) {
    return function () {
      notification[type]({
        message: title,
        description: content,
        duration: 8,
      });
    };
  },
};

export default fetchData;
