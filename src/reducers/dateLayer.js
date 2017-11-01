import { combineReducers } from 'redux'
import { UPDATA_DATE } from '../actions/dateLayer.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const format = "YYYY-MM-DD";
const zhNow = moment().utcOffset(8);

var initState = {
    timeRange: 'day',//date=1~23小时,week=周一~周日,range<=92天
    fromDay: zhNow,
    fromDayStr: moment().format(format),
    toDay: zhNow,
    toDayStr: moment().format(format),
    timeType: 'day'
  };

function DateLayer(state = initState, action){
  if(action.type){
    switch(action.type){
      case 'UPDATA_DATE':
        return Object.assign({}, state, action);
        break;
      default:
        return state;
    }
  }
}

export default DateLayer
