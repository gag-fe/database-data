import Store from 'Store2';

let shopId = Store.get('user_data') ? Store.get('user_data').shopId : '' || '';
let shopName = Store.get('user_data') ? Store.get('user_data').shopName : '' || '';
let userName = Store.get('user_data') ? Store.get('user_data').userName : '' || '';

export default {
  price: {
    tableList: [],
    buteList: [],
    totalList: [],
  },
  pay: {
    tableList: {
      "pageIndex": 1,
      "pageSize": 1,
      "total": 1,
      rows: []
    },
    payLoading: false,
    paymentSum: {
      "all": {
        "paymentByDim": []
      },
      "shopEntityTypeStats": [
        {
          "shopEntityType": "服务",
          "paymentByDim": []
        }
      ]
    }
  },
  bill: {
    tableList: [],
    picList: []
  },
  //机构列表
  org: {
    orgList: [],
    shopId: shopId,
    shopName: shopName,
    loading: false
  },
  //init 权限
  layout: {
    categoryType: [],
    floor: [],
    funcAuthorities: [],
    funcAuthoritiesObj: {},
    orgType: "D",
    shopId: shopId,
    shopName: shopName,
    userName: userName
  },
  dateLayer: {},
  brandNews: {
    brandList: [],
    brandsSort: {},
    brandNewsList: [],
    loading: false,
    searchParams: {
      brandIds: '',
      brandName: '',
      shopId: '',
      pageIndex: 1,
      pageSize: 20,
      total: 1
    }
  },
  brandSubscibe: {
    visibleAddBrand: false,
    brandList: [],
    brandListAdd: [],
    brandListDisabled: [],
    loading: false,
    brandNum:0,
    brandLimimNum: 0,
    searchParamsDisabled:{
      shopId:'',
      pageIndex: 1,
      pageSize: 500,
      total: 1
    },
    searchParams:{
      keyword:'',
      shopId:''
    }
  }
};
