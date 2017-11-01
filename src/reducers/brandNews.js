var initState = {
  brandList: [],
  brandsSort: {},
  brandNewsList: [],
  loading: false,
  searchParams:{
    brandIds:'',
    brandName:'',
    shopId:'',
    pageIndex: 1,
    pageSize: 20,
    total: 1
  }
};

function BrandNews(state = initState, action){

  if(action.type){
    switch(action.type){
      case 'LOADING':
        return Object.assign({}, state, action);
        break;
      case 'GET_BRAND_NEWS_LIST':
        return Object.assign({}, state, action);
        break;
      case 'UPDATE_SEARCH_PARAMS':
        return Object.assign({}, state, action);
        break;
      case 'SOLICTUDE_BRAND':
        return Object.assign({}, state, action);
        break;
      case 'CANCE_BRAND':
        return Object.assign({}, state, action);
        break;
      default:
        return state;
    }
  }
}

export default BrandNews;
