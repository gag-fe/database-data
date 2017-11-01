import { combineReducers } from 'redux';
import price from './price';
import pay from './pay';
import bill from './bill';
import org from './org';
import layout from './layout';
import dateLayer from './dateLayer';
import deduction from './deduction';
import frame from './frame';
import brandNews from './brandNews';
import brandSubscibe from './brandSubscibe';

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
  price,
  pay,
  bill,
  org,
  layout,
  dateLayer,
  deduction,
  frame,
  brandNews,
  brandSubscibe
});

export default rootReducer;
