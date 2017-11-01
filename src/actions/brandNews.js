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
  SETMALLVERSION: APP_CONFIG.api.YUQING + "/setMallVersion.json"//机构设置
};

console.log(API);

function _getBrandNewsListAjax(postData, dispatch, getState) {
  Ajax({
    url: API.GETINFOMATIONLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    let state = getState().brandNews;
    if (resp.status == 'S') {
      let data = resp.data;
      let searchParams = Object.assign({}, state.searchParams, {total: data.total});
      //添加品牌新闻分类
      let brandsSort = {};

      data.rows.map(item => {
        if(item.brandId){
          brandsSort['_' + item.brandId] = [];
        }
      });

      data.rows.map(item => {
        if(brandsSort['_' + item.brandId]){
          brandsSort['_' + item.brandId].push(item);
        }
      });


      let setSate = Object.assign({}, state, {type: 'GET_BRAND_NEWS_LIST', loading: false, 'searchParams': searchParams, 'brandNewsList': data.rows, 'brandsSort': brandsSort});
      dispatch(setSate, {type: 'GET_BRAND_NEWS_LIST', loading: false});
    }else{
      let loadSetState = Object.assign({},state, {type: 'LOADING', loading: false});
      dispatch(loadSetState, {type: 'LOADING', loading: false});
    }
  });
}


//获取品牌咨询数据列表
const getBrandNewsList = () => (dispatch, getState) => {
  let state = getState().brandNews;
  let searchParams = state.searchParams;
  let postData = {};
      postData['pageIndex'] = searchParams.pageIndex;
      postData['pageSize'] = searchParams.pageSize;
      postData['brandIds'] = searchParams.brandIds;
      postData['brandName'] = searchParams.brandName;
      postData['shopId'] = searchParams.shopId;

  let loadSetState = Object.assign({},state, {type: 'LOADING', loading: true});
  dispatch(loadSetState, {type: 'LOADING', loading: true});

  _getBrandNewsListAjax(postData, dispatch, getState);
/*
  Ajax({
    url: API.GETINFOMATIONLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let data = resp.data;
      let searchParams = Object.assign({}, state.searchParams, {pageIndex: data.pageIndex, total: data.total});
      let setSate = Object.assign({}, state, {type: 'GET_BRAND_NEWS_LIST', loading: false, searchParams: searchParams, brandNewsList: data.rows});
      dispatch(setSate, {type: 'GET_BRAND_NEWS_LIST', loading: false});
    }else{

    }
  });
  */
};

//更新检索参数
const updateSearchParams = (params) => (dispatch, getState) => {
  let paramsObj = params || {};
  let state = getState().brandNews;
  let stateOrg = getState().org;
  let searchParams = Object.assign({}, state.searchParams, {'shopId': stateOrg.shopId,'shopName': stateOrg.shopName, 'userName': stateOrg.userName}, paramsObj);
  let setState = Object.assign({}, state, {searchParams: searchParams, type: 'UPDATE_SEARCH_PARAMS'});
  dispatch(setState, {type: 'UPDATE_SEARCH_PARAMS'});
};

//文章相关性评价
const setArticleEvaluation = (params) => (dispatch, getState) => {
  let state = getState().brandNews;
  let searchParams = state.searchParams;
  let stateLayout = getState().layout;
  let postData = {};

  postData['userName'] = stateLayout.userName;
  postData['shopId'] = searchParams.shopId;
  postData = Object.assign({}, postData, params);

  let loadSetState = Object.assign({},state, {type: 'LOADING', loading: true});
  dispatch(loadSetState, {type: 'LOADING', loading: true});

  Ajax({
    url: API.SETARTICLEEVALUACTION,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let loadSetState = Object.assign({},state, {type: 'LOADING', loading: false});
      dispatch(loadSetState, {type: 'LOADING', loading: false});
    }else{
      let loadSetState = Object.assign({},state, {type: 'LOADING', loading: false});
      dispatch(loadSetState, {type: 'LOADING', loading: false});
    }
  });
};


//获取品牌数据列表
/*
const getBrandList = () => (dispatch, getState) => {
  let state = getState().brandSubscibe;
  let searchParams = state.searchParams;
  let postData = {};

  postData['pageIndex'] = state.pageIndex;
  postData['pageSize'] = state.pageSize;
  postData['brandIds'] = searchParams.brandIds;
  postData['brandName'] = searchParams.brandName;
  postData['shopId'] = searchParams.shopId;
  postData['status'] = 1;

  let loadSetState = Object.assign({},state, {type: 'GET_BRAND_LIST', loading: true});
  dispatch(loadSetState, {type: 'GET_BRAND_LIST', loading: true});

  Ajax({
    url: API.GETBRANDLIST,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let data = resp.data;
      let newState = getState().brandSubscibe;
      let setSate = Object.assign({}, newState, {type: 'GET_BRAND_LIST', loading: false, brandList: data.rows});
      dispatch(setSate, {type: 'GET_BRAND_LIST', loading: false});
    }
  });
};
*/

//关注品牌
const solicitudeBrand = (params) => (dispatch, getState) => {
  let state = getState().brandNews;
  let searchParams = state.searchParams;
  let stateLayout = getState().layout;
  let postData = {};

  postData['userName'] = stateLayout.userName;
  postData['shopId'] = searchParams.shopId;
  postData = Object.assign({}, postData, params);

  let loadSetState = Object.assign({},state, {type: 'LOADING', loading: true});
  dispatch(loadSetState, {type: 'LOADING', loading: true});

  Ajax({
    url: API.SETFOLLOWBRAND,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {

      let stateNew = getState().brandNews;
      let searchParams = stateNew.searchParams;
      let postDataParams = {};

      postDataParams['pageIndex'] = searchParams.pageIndex;
      postDataParams['pageSize'] = searchParams.pageSize;
      postDataParams['shopId'] = searchParams.shopId;
      postDataParams['status'] = 1;
      //_getBrandNewsListAjax(postDataParams, dispatch, getState);

      //逻辑变更
      let brandNewsList = stateNew.brandNewsList;
      let brandsSort = stateNew.brandsSort;
      let newBrandNewsList = [];
      let cancelBrands = brandsSort['_' + params.brandIds];
      let itemsBrandIds = {};
      cancelBrands.map(item => {
        itemsBrandIds['_' + item.id] = item;
      });


      brandNewsList.map((item, idx) => {
        if(itemsBrandIds['_' + item.id]){
          newBrandNewsList.push(Object.assign({}, item, {'status': 1}));
        }else {
          newBrandNewsList.push(item);
        }
      });

      let brandNewsSetState = Object.assign({}, stateNew, {'brandNewsList': newBrandNewsList, type: 'SOLICTUDE_BRAND', loading: false});
      dispatch(brandNewsSetState, {type:'SOLICTUDE_BRAND', loading: false});
    }
  });
};

//取消品牌
const cancelBrand = (params) => (dispatch, getState) => {
  let state = getState().brandNews;
  let searchParams = state.searchParams;
  let stateLayout = getState().layout;
  let postData = {};

  postData['userName'] = stateLayout.userName;
  postData['shopId'] = searchParams.shopId;
  postData = Object.assign({}, postData, params);

  let loadSetState = Object.assign({},state, {type: 'LOADING', loading: true});
  dispatch(loadSetState, {type: 'LOADING', loading: true});

  Ajax({
    url: API.SETUNFOLLOWBRAND,
    data: postData,
    type: 'json',
  }).then(resp => {
    if (resp.status == 'S') {
      let data = resp.data;

      let stateNew = getState().brandNews;
      let searchParams = stateNew.searchParams;
      let postDataParams = {};

      postDataParams['pageIndex'] = searchParams.pageIndex;
      postDataParams['pageSize'] = searchParams.pageSize;
      postDataParams['shopId'] = searchParams.shopId;
      postDataParams['status'] = 1;

      //_getBrandNewsListAjax(postDataParams, dispatch, getState);
      //逻辑变更
      let brandNewsList = stateNew.brandNewsList;
      let brandsSort = stateNew.brandsSort;
      let newBrandNewsList = [];
      let cancelBrands = brandsSort['_' + params.brandIds];
      let itemsBrandIds = {};
      cancelBrands.map(item => {
        itemsBrandIds['_' + item.id] = item;
      });


      brandNewsList.map((item, idx) => {
        if(itemsBrandIds['_' + item.id]){
          newBrandNewsList.push(Object.assign({}, item, {'status': 0}));
        }else {
          newBrandNewsList.push(item);
        }
      });

      let brandNewsSetState = Object.assign({}, stateNew, {'brandNewsList': newBrandNewsList, type: 'CANCE_BRAND', loading: false});
      dispatch(brandNewsSetState, {type:'CANCE_BRAND', loading: false});
    }
  });
};
export default {
  updateSearchParams,
  getBrandNewsList,
  setArticleEvaluation,
  solicitudeBrand,
  cancelBrand
};
