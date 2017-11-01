import { combineReducers } from 'redux';
import { BILL_FIN, BILL_PIC, BILL_EDITOR,BILL_VISIBLE} from '../actions/bill.js';

var initState = {
  tableList:[],
  picList:[],
  billVisible:false
};

function bill (state = initState, action) {
  if(action.type){
    switch(action.type){
      case BILL_FIN:
        return Object.assign({}, state, action);
      case BILL_PIC:
        return Object.assign({}, state, action);
      case BILL_EDITOR:
        return Object.assign({}, state, action);
      case BILL_VISIBLE:
        return Object.assign({}, state, action);
      default:
        return state;
    }
  }
}

export default bill;
