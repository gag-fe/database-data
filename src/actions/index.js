import Price from './price';
import Pay from './pay';
import Bill from './bill';
import Org from './org';
import Layout from './layout';
import DateLayer from './dateLayer';
import Deduction from './deduction';
import Frame from './frame';
import BrandNews from './brandNews';
import BrandSubscibe from './brandSubscibe';

const actionContainer = Object.assign({}, Price, Pay, Bill, Org, Layout, DateLayer, Deduction, Frame, BrandNews, BrandSubscibe);
console.log(actionContainer);
export default actionContainer;
