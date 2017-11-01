import { combineReducers } from 'redux';
import Store from 'store2';
import { GET_ORG } from '../actions/layout.js';


var initState = {
    categoryType:[],
    floor: [],
    funcAuthorities: [],
    funcAuthoritiesObj: {},
    orgType:"D",
    shopId: Store.get('user_data') ? Store.get('user_data').shopId : '' || '',
    shopName: Store.get('user_data') ? Store.get('user_data').shopName : '' || '',
    userName: ""
  };

function Layout(state = initState, action){
  if(action.type){
    switch(action.type){
      case 'GET_INIT':
        return Object.assign({}, state, action);
        break;
      case 'SET_INIT_ORG':
        return Object.assign({}, state, action);
        break;
      case 'UPDATA_ORG':
        const userData =  Object.assign({}, state, action);
        Store.set('user_data', userData);
        return userData;
        break;
      default:
        return state;
    }
  }
}

export default Layout
