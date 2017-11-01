import fetch from 'isomorphic-fetch';
export const PAY_FIN = 'PAY_FIN';


import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;

const API = {
  PAYMENTSUN: APP_CONFIG.api.URLFIX + "/payment/paymentSum.json",
  DISTRIBUTION: APP_CONFIG.api.URLFIX + "/payment/distribution.json",
};

// 按店铺粒度 统计各种支付方式占比
export const getAllProducts = () => dispatch => {
  shop.getProducts(products => {
    dispatch(receiveProducts(products))
  })
}
const payAction = data => ({
  type:'DISTRIBUTION',
  pay: data
})
const getPayDistribution = entryParameter=>(dispatch,getState) =>{
  dispatch(payAction({payLoading:true}));
  var postData =entryParameter;
  Ajax({
      url: API.DISTRIBUTION,
      data: postData,
      type: 'json',
    }).then(resp => {
      if(resp.status == 'S'){
        const data = resp.data;
        const temp = {
          tableList:data,
          payLoading:false
        };
        dispatch(payAction(temp));
      }
    });
}
const getPaymentSum = entryParameter=>(dispatch,getState) =>{
  dispatch(payAction({payLoading:true}));
  var postData =entryParameter;
  Ajax({
      url: API.PAYMENTSUN,
      data: postData,
      type: 'json',
    }).then(resp => {
      if(resp.status == 'S'){
        const data = resp.data;
        data.all.shopEntityType="全部";
        data.shopEntityTypeStats.unshift(data.all);
        const temp = {
          paymentSum:data
        };
        dispatch(payAction(temp));
      }
    });
};

export default {
  getPaymentSum,
  getPayDistribution
}
