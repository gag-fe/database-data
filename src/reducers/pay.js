import { combineReducers } from 'redux';
//import { PAY_FIN } from '../actions/pay.js';

var initState = {
  tableList:{
    "pageIndex": 1,
    "pageSize": 1,
    "total": 1,
    rows:[]
  },
  payLoading:false
};

function pay (state = initState, action) {
  if(action.type){
    switch(action.type){
      case 'DISTRIBUTION':
        return Object.assign({}, state, action.pay);
        break;
        case 'PAYMENTSUN':
          return Object.assign({}, state, action.pay);
          break;
      default:
        return state;
    }
  }
}

export default pay;
