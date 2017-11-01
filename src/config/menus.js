import React from 'react';
import Icon from '@gag/icon-web';

// modules

//价格分布
import PriceDistribute from '../modules/operate/price-distribute/index';
//支付方式分析
import PayAnalyze from '../modules/operate/pay-analyze/index';
//日结单规则
import DayBill from '../modules/set/day-bill/index';
//购物时段
import TimeFrame from '../modules/operate/time-frame/index';
//支付方式抵扣
import PayDeduction from '../modules/set/pay-deduction/index';
//舆情监控
//舆情监控-品牌咨询
import BrandNews from '../modules/news/brand-news/index';
//舆情监控-品牌监控
import BrandSubscibe from '../modules/news/brand-subscibe/index';

var origin =  window.location.origin;
const menus = [{
  key: 'total',
  title: '总体数据',
  icon: <Icon type="desktop" />,
  id: 91,
  parentAuthorityId: 9,
  children: [{
    key: 'chain-related',
    title: '综合分析',
    id: 9104,
    parentAuthorityId: 91,
    targetUrl: origin + '/#/chain-related',
  }, {
    key: 'year-basis',
    title: '对比分析',
    id: 9101,
    parentAuthorityId: 91,
    targetUrl: origin + '/#/year-basis',
  }],
},{
  key: 'shop',
  title: '店铺数据',
  icon: <Icon type="bar-chart" />,
  id: 92,
  parentAuthorityId: 9,
  children: [{
    key: 'entity',
    title: '销售分析',
    id: 9202,
    parentAuthorityId: 92,
    targetUrl: origin + '/#/entity',
  }, {
    key: 'storeContrast',
    title: '对比分析',
    id: 9205,
    parentAuthorityId: 92,
    targetUrl: origin + '/#/storeContrast',
  }, {
    key: 'sumChannel',
    title: '上报导入',
    id: 9206,
    parentAuthorityId: 92,
    targetUrl: origin + '/#/sumChannel',
  }],
}, {
  key: 'product',
  title: '商品数据',
  icon: <Icon type="shopping-cart" />,
  id: 93,
  parentAuthorityId: 9,
  children:[{
    key: 'commodity',
    title: '商品统计',
    id: 9303,
    parentAuthorityId: 93,
    targetUrl: origin + '/#/commodity',
  }]
}, {
  key: 'operate',
  title: '运营数据',
  icon: <Icon type="line-chart" />,
  id: 94,
  parentAuthorityId: 9,
  children:[{
    key: 'priceDistribute',
    title: '价格分布',
    component: PriceDistribute,
    id: 9401,
    parentAuthorityId: 94,
  }, {
    key: 'payAnalyze',
    title: '支付方式',
    component: PayAnalyze,
    id: 9402,
    parentAuthorityId: 94
  }, {
    key: 'timeFrame',
    title: '购物时段',
    component: TimeFrame,
    id: 9403,
    parentAuthorityId: 94
  }]
}, {
  key: 'set',
  title: '设置',
  icon: <Icon type="setting" />,
  id: 95,
  parentAuthorityId: 9,
  children:[{
    key: 'dayBill',
    title: '日结单',
    component: DayBill,
    id: 9501,
    parentAuthorityId: 95
  }, {
    key: 'payDeduction',
    title: '支付方式抵扣',
    component: PayDeduction,
    id: 9502,
    parentAuthorityId: 95
  }]
},{
  key: 'news',
  title: '舆情监控',
  icon: <Icon type="tags" />,
  id: 96,
  parentAuthorityId: 9,
  children:[{
    key: 'brandNews',
    title: '品牌资讯',
    component: BrandNews,
    id: 9601,
    parentAuthorityId: 96
  }, {
    key: 'brandSubscibe',
    title: '品牌关注',
    component: BrandSubscibe,
    id: 9602,
    parentAuthorityId: 96
  }]
}];
export default menus;
