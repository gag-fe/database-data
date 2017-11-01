export const PAY_FIN = 'PAY_FIN';
import Notification from '@gag/notification-web';
import Utils from '../utils/index';
import Permission from '../components/permission/index';
const Ajax = Utils.ajax;
const CommonUtils = Utils.common;
const API = {

  GETBRANDLIST: APP_CONFIG.api.YUQING + "/getBrandList.json",//品牌列表
  SETUNFOLLOWBRAND: APP_CONFIG.api.YUQING + "/setUnFollowBrand.json",//取消关注
  SETFOLLOWBRAND: APP_CONFIG.api.YUQING + "/setFollowBrand.json",//关注品牌
  GETINFOMATIONLIST: APP_CONFIG.api.YUQING + "/getInformationList.json",//咨询列表
  SETARTICLEEVALUACTION: APP_CONFIG.api.YUQING + "/setArticleEvaluation.json",//文章评价
  DELETBRAND: APP_CONFIG.api.YUQING + "/deleteBrand.json",//删除品牌
  EDITBRAND: APP_CONFIG.api.YUQING + "/editBrand.json",//品牌编辑
  SETMALLVERSION: APP_CONFIG.api.YUQING + "/setMallVersion.json",//机构设置
  GETMALLBRANDNUM: APP_CONFIG.api.YUQING + "/getMallBrandNum.json",//获取机构的品牌限制数
};

//获取品牌列表
function _getBrandListAjax(postData, dispatch, getState) {
  Ajax({
    url: API.GETBRANDLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let newState = getState().brandSubscibe;
      let data = resp.data;
      let setSate = Object.assign({}, newState, {type: 'GET_BRAND_LIST', loading: false, brandList: data.rows});
      dispatch(setSate, {type: 'GET_BRAND_LIST'});
    }
  });
}

//获取机构初始化关注品牌数量

function _getInitBrandLimimNumAjax(postData, dispatch, getState) {
  Ajax({
    url: API.GETMALLBRANDNUM,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let newState = getState().brandSubscibe;
      let setState = Object.assign({}, newState, {brandLimimNum: resp.data.limit, brandNum: resp.data.num, type: 'INIT_BRAND_LIMIT_NUM'});
      dispatch(setState, {type: 'INIT_BRAND_LIMIT_NUM'});
    }
  });
}

//获取品牌数据列表
const getBrandList = (params) => (dispatch, getState) => {
  let params = params || {'status':1};
  let state = getState().brandSubscibe;
  let searchParams = state.searchParams;
  let postData = {};

  postData['shopId'] = searchParams.shopId;
  postData['keyword'] = searchParams.keyword;
  postData['status'] = params.status || 1;

  let loadSetState = Object.assign({},state, {type: 'LOADING2', loading: true});
  dispatch(loadSetState, {type: 'LOADING2', loading: true});

  _getBrandListAjax(postData, dispatch, getState);
  _getInitBrandLimimNumAjax(postData, dispatch, getState);
};


//关注品牌
const solicitudeBrandAdd = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let stateLayout = getState().layout;
  let postData = {};

  postData['userName'] = stateLayout.userName;
  postData['shopId'] = stateLayout.shopId;
  postData = Object.assign({}, postData, params);

  let loadSetState = Object.assign({},state, {type: 'LOADING2', loading: true});
  dispatch(loadSetState, {type: 'LOADING2', loading: true});

  Ajax({
    url: API.SETFOLLOWBRAND,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let searchParams = state.searchParams;
      let postDataParams = {};
          postDataParams['shopId'] = searchParams.shopId;
          postDataParams['status'] = 1;

      if(resp.data.status == 'S'){
        _getBrandListAjax(postDataParams, dispatch, getState);
        _getInitBrandLimimNumAjax(postDataParams, dispatch, getState);
      }else{
        let loadSetState = Object.assign({},state, {type: 'LOADING2', loading: false});
        dispatch(loadSetState, {type: 'LOADING2', loading: false});
        CommonUtils.modal('warning', '警告', '您最多可关注' + resp.data.limit + '个品牌，当前已关注' + resp.data.num + '个，无法关注更多的品牌。此次超出了品牌限制数量，请与购阿购的销售或项目管理人员联系。');
        //_getBrandListAjax(postDataParams, dispatch, getState);
        //_getInitBrandLimimNumAjax(postDataParams, dispatch, getState);
      }
    }
  })
};

//获取为关注品牌数据列表
const getBrandListDisabled = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let searchParams = state.searchParamsDisabled;
  let postData = {};

  postData['keyword'] = searchParams.keyword;
  postData['pageIndex'] = searchParams.pageIndex;
  postData['pageSize'] = searchParams.pageSize;
  postData['shopId'] = searchParams.shopId;
  postData['status'] = 0;

  Ajax({
    url: API.GETBRANDLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let data = resp.data;
      let newState = getState().brandSubscibe;
      let searchParamsDisabled = Object.assign({}, newState.searchParamsDisabled, {total: data.total});
      let setSate = Object.assign({}, newState, {type: 'GET_BRAND_DISABLED_LIST', brandListDisabled: data.rows, searchParamsDisabled: searchParamsDisabled, loading: false});
      dispatch(setSate, {type: 'GET_BRAND_DISABLED_LIST', loading: false});
    }else {
      let loadSetState = Object.assign({},state, {type: 'LOADING2', brandList: [], loading: false});
      dispatch(loadSetState, {type: 'LOADING2', loading: false});
    }
  });
};

//获取为关注品牌数据累计
const getBrandListDisabledAddUp = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let searchParams = state.searchParamsDisabled;
  let postData = {};

  postData['keyword'] = searchParams.keyword;
  postData['pageIndex'] = searchParams.pageIndex + 1;
  postData['pageSize'] = searchParams.pageSize;
  postData['shopId'] = searchParams.shopId;
  postData['status'] = 0;

  let loadSetState = Object.assign({},state, {type: 'LOADING2', brandList: [], loading: true});
  dispatch(loadSetState, {type: 'LOADING2', loading: true});


  Ajax({
    url: API.GETBRANDLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let data = resp.data;
      let newState = getState().brandSubscibe;
      let brandListDisabled = newState.brandListDisabled.concat(data.rows);
      let setSate = Object.assign({}, newState, {type: 'GET_BRAND_DISABLED_LIST_ADD_UP', brandListDisabled: brandListDisabled, loading: false});
      dispatch(setSate, {type: 'GET_BRAND_DISABLED_LIST_ADD_UP', loading: false});
    }
  });
};


//更新检索品牌订阅参数
const updateSearchParamsSubscibe = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let stateOrg = getState().org;
  let searchParamsDisabled = Object.assign({}, state.searchParamsDisabled, {'shopId': stateOrg.shopId,'shopName': stateOrg.shopName}, params);
  let setState = Object.assign({}, state, {searchParamsDisabled: searchParamsDisabled, type: 'UPDATE_BRAND_SEARCH_PARAMS'});
  dispatch(setState, {type: 'UPDATE_BRAND_SEARCH_PARAMS'});
};


//更新检索品牌检索参数
const updateSearchParamsSubscibeInput = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let stateOrg = getState().org;
  let searchParams = Object.assign({}, state.searchParams, {'shopId': stateOrg.shopId, 'userName': stateOrg.userName}, params);
  let setState = Object.assign({}, state, {searchParams: searchParams, type: 'UPDATE_BRAND_SEARCH_PARAMS_INPUT'});
  dispatch(setState, {type: 'UPDATE_BRAND_SEARCH_PARAMS_INPUT'});
};

//取消品牌
const delBrandList = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let searchParams = state.searchParams;
  let postData = {};

  postData['shopId'] = searchParams.shopId;
  postData = Object.assign({}, postData, params);

  let loadSetState = Object.assign({},state, {type: 'LOADING2', brandList: [], loading: true});
  dispatch(loadSetState, {type: 'LOADING2', loading: true});

  Ajax({
    url: API.SETUNFOLLOWBRAND,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let searchParams = state.searchParams;
      let postDataParams = {};

      postDataParams['shopId'] = searchParams.shopId;
      postDataParams['status'] = 1;

      _getBrandListAjax(postDataParams, dispatch, getState);
      _getInitBrandLimimNumAjax(postData, dispatch, getState);
    }
  });
};

//添加brand的浮层控制 visibleAddBrand
const visibleAddBrandFn = (params) => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let setState = Object.assign({}, state, {visibleAddBrand: params, type: 'VISIBLE_ADD_BRAND', loading: false});
  dispatch(setState, {type: 'VISIBLE_ADD_BRAND'});
};

//初始化获取机构品牌数量
const initBrandLimimNum = () => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let searchParams = state.searchParams;
  let postData = {};
      postData['shopId'] = searchParams.shopId;

  _getInitBrandLimimNumAjax(postData, dispatch, getState);
};

export default {
  initBrandLimimNum,
  getBrandList,
  updateSearchParamsSubscibe,
  delBrandList,
  visibleAddBrandFn,
  getBrandListDisabled,
  getBrandListDisabledAddUp,
  updateSearchParamsSubscibeInput,
  solicitudeBrandAdd
};
