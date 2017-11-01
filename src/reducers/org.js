import { combineReducers } from 'redux';
import Store from 'store2';
import { GET_ORG, UPDATA_ORG, SET_INIT_ORG } from '../actions/org.js';

var initState = {
    orgList:[],
    shopId: Store.get('user_data') ? Store.get('user_data').shopId : '' || '',
    shopName: Store.get('user_data') ? Store.get('user_data').shopName : '' || '',
    loading: false
  };

function Org(state = initState, action){

  if(action.type){
    switch(action.type){
      case 'GET_ORG':
        return Object.assign({}, state, action);
        break;
      case 'UPDATA_ORG':
        return Object.assign({}, state, action);
        break;
      default:
        return state;
    }
  }
}

export default Org
