import { combineReducers } from 'redux';
import { FRAME_CHART, FRAME_LIST} from '../actions/frame.js';

var initState = {
  frameData:[],
  frameListData:[]
};

function frame (state = initState, action) {
  if(action.type){
    switch(action.type){
      case FRAME_CHART:
        return Object.assign({}, state, action);
      case FRAME_LIST:
        return Object.assign({}, state, action);
      default:
        return state;
    }
  }
}

export default frame;
