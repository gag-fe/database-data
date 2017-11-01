import { combineReducers } from 'redux';
import { DEDUCTION_FIN ,DEDUCTION_SET,EDITOR_VISIBLE} from '../actions/deduction.js';

var initState = {
  deductionList:[],
  
};

function deduction (state = initState, action) {
  if(action.type){
    switch(action.type){
      case DEDUCTION_FIN:
        return Object.assign({}, state, action);
      case DEDUCTION_SET:
        return Object.assign({}, state, action);
      case EDITOR_VISIBLE:
        return Object.assign({}, state, action);
      default:
        return state;
    }
  }
}

export default deduction;
