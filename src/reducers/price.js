import { combineReducers } from 'redux';
import { PRICE_FIN ,PRICE_BUTE, PRICE_TOTAL} from '../actions/price.js';

var initState = {
  tableList: [],
  buteList:[],

};

function price (state = initState, action) {
  if(action.type){
    switch(action.type){
      case PRICE_FIN:
        return Object.assign({}, state, action);
      case PRICE_BUTE:
        return Object.assign({}, state, action);

      default:
        return state;
    }
  }
}

export default price;
