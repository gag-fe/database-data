import React from 'react';
import Table from '@gag/table-web';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Form from '@gag/form-web';
import Row from '@gag/row-web';
import Col from '@gag/col-web';
import Select from '@gag/select-web';
import Pagination from '@gag/pagination-web';
import Input from '@gag/input-web';
import Button from '@gag/button-web';
import Modal from '@gag/modal-web';
import List from '../../components/list';
import Icon from '@gag/icon-web';
import Store from 'store2';
import * as PriceActions from '../../../actions/index';
import Moment from 'moment';
import OrganizationTree from '../../components/organizationTree';
import BrandList from '../components/brandList';

import './index.less';
const FORMAT = 'YYYY-MM-DD';
class BrandNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageIndex: 1
    };
  }

  _searchButton = () => {
    let params = {};
        params['pageIndex'] = 1;
    this.props.updateSearchParams(params);
    this.props.getBrandNewsList();
  }


  _brandNameChange = (e) =>{
    let val = e.target.value;
    let params = {};
        params['brandName'] = val;
        params['brandIds'] = '';
    this.props.updateSearchParams(params);
  }

  _getOrgInfo = (obj) => {
    let params = {
      'shopName': obj.shopName,
      'shopId': obj.shopId
    };

    this.props.updateSearchParams(params);
  }
  //翻页
  _turnPage = (page, pageSize) => {
    let params = {};
        params['pageIndex'] = page;
    this.props.updateSearchParams(params);
    this.props.getBrandNewsList();
  }
  _onShowSizeChange = (current, pageSize) => {
    let params = {};
    params['pageIndex'] = current;
    params['pageSize'] = pageSize;

    this.props.updateSearchParams(params);
    this.props.getBrandNewsList();
  }

  componentDidMount() {
    let params = {};
        params['pageIndex'] = 1;
        params['brandName'] = '';
        params['brandIds'] = '';
    this.props.updateSearchParams(params);
    this.props.getBrandNewsList();
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    const pagination = {
      defaultCurrent: 1,
      total: this.props.brandNews.searchParams.total,
      current: this.props.brandNews.searchParams.pageIndex,
      pageSize: this.props.brandNews.searchParams.pageSize,
      onChange: this._turnPage,
      showSizeChanger: true,
      onShowSizeChange: this._onShowSizeChange,
      showTotal:(total, range) => `显示第${range[0]}到第${range[1]}条记录  总共${total}条记录`
    };

    return (
      <div className="brand-news">
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org} callback={this._getOrgInfo}></OrganizationTree>
          <div className="submit-button">搜索： <Input placeholder="品牌检索词" style={{width:'402px',marginLeft:'15px',marginRight:'20px'}} value={this.props.brandNews.searchParams.brandName} onChange={this._brandNameChange}/> <Button type="danger" icon="search" onClick={this._searchButton}>检索</Button></div>
        </div>
        <div className="wrapper-box util-clearfix">
          <BrandList {...this.props}></BrandList>
          <Pagination {...pagination}/>
        </div>
      </div>
    );
  }
}
//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    brandNews: state.brandNews,
    org: state.org,
    layout: state.layout,
    brandSubscibe: state.brandSubscibe
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(PriceActions, dispatch);
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(BrandNews);
