var initState = {
  visibleAddBrand: false,
  brandList: [],
  brandListAdd: [],
  brandListDisabled: [],
  loading: false,
  brandNum:0,
  brandLimimNum: 0,
  searchParamsDisabled:{
    status: 0,
    keyword:'',
    shopId:'',
    pageIndex: 1,
    pageSize: 500,
    total: 1
  },
  searchParams:{
    keyword:'',
    shopId:''
  }
};

function Org(state = initState, action){

  if(action.type){
    switch(action.type){
      case 'GET_BRAND_LIST':
        return Object.assign({}, state, action);
        break;
      case 'UPDATE_BRAND_SEARCH_PARAMS':
        return Object.assign({}, state, action);
        break;
      case 'UPDATE_BRAND_SEARCH_PARAMS_INPUT':
        return Object.assign({}, state, action);
        break;
      case 'VISIBLE_ADD_BRAND':
        return Object.assign({}, state, action);
        break;
      case 'GET_BRAND_DISABLED_LIST':
        return Object.assign({}, state, action);
        break;
      case 'GET_BRAND_DISABLED_LIST_ADD_UP':
        return Object.assign({}, state, action);
        break;
      case 'SOLICTUDE_BRAND_ADD':
        return Object.assign({}, state, action);
        break;
      case 'INIT_BRAND_LIMIT_NUM':
        return Object.assign({}, state, action);
        break;
      case 'LOADING2':
        return Object.assign({}, state, action);
        break;
      default:
        return state;
    }
  }
}

export default Org;
