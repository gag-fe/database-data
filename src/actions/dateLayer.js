export const UPDATA_DATE = 'UPDATA_DATE';
import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;


function updata (state){
  return {
    type: UPDATA_DATE,
    ...state
  }
}
//更新Store的 日期信息
function updataData (state) {
  return (dispatch, getState) => {
    dispatch(updata(state, {type: UPDATA_DATE}));
  }
}


export default {
  updataData
}
