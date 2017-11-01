import React from 'react';
import Table from '@gag/table-web';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Form from '@gag/form-web';
import Row from '@gag/row-web';
import Col from '@gag/col-web';
import Select from '@gag/select-web';
import DatePicker from '@gag/date-picker-web';
import Input from '@gag/input-web';
import Button from '@gag/button-web';
import Tag from '@gag/tag-web';
const CheckableTag = Tag.CheckableTag;
import Icon from '@gag/icon-web';
import Spin from '@gag/spin-web';
import Popconfirm from '@gag/popconfirm-web';
import Store from 'store2';
import * as PriceActions from '../../../actions/index';
import OrganizationTree from '../../components/organizationTree';
import  AddBrand from './addBrand';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
class BrandSubscibe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _delTagAaction = (brandId, brandName, e) => {
    e.preventDefault();
    let item = {};
    item['brandIds'] = brandId;
    item['brandName'] = brandName;
    this.props.delBrandList(item);
  }


  _addsubscribe = () => {
    let params = {
      'status': 0,
      'keyword': '',
      'pageIndex': 1
    };

    this.props.getBrandListDisabled(params);
    this.props.visibleAddBrandFn(true);
  }

  renderTagList = () => {
    let html =[];
    if(this.props.brandSubscibe.brandList && this.props.brandSubscibe.brandList.length > 0){
      this.props.brandSubscibe.brandList.map(item => {
        if(item && item.brandId && item.brandName){
          html.push(
            <Tag closable={true} onClose={this._delTagAaction.bind(this,item.brandId, item.brandName)}>{item.brandName}</Tag>
          );
        }else{
          console.log('error data:', item);
        }
      });

      html.push(<Button type="primary" icon="plus" size="small" onClick={this._addsubscribe.bind(this)}>添加</Button>);
    }else {
      html = [(<div><div className="no-data" style={{display: this.props.brandSubscibe.loading?'none':'block'}}><Icon type="frown-o" /> 暂无数据</div><Button type="primary" icon="plus" size="small" onClick={this._addsubscribe.bind(this)}>添加</Button></div>)];
    }
    return html;
  }

  _searchButton = () =>{
    let params = {
      'status': 1
    };
    this.props.getBrandList(params);
  }

  _brandNameChange = (e) =>{
    let value = e.target.value;
    let params = {};
        params['keyword'] = value;
    this.props.updateSearchParamsSubscibeInput(params);
  }

  _getOrgInfo = (obj) => {
    let params = {
      'shopName': obj.shopName,
      'shopId': obj.shopId
    };

    this.props.updateSearchParamsSubscibe(params);
    this.props.updateSearchParamsSubscibeInput(params);
  }

  componentDidMount() {
    let params = {
      'status': 1,
      'keyword': ''
    };

    let params2 = {
      'status': 0,
      'keyword': '',
      'pageIndex': 1
    };

    this.props.updateSearchParamsSubscibe({});
    this.props.updateSearchParamsSubscibeInput(params);
    this.props.getBrandList(params);
    this.props.getBrandListDisabledAddUp(params);
    //this.props.getBrandListDisabled(params2);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div className="brand-subscibe">
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org} callback={this._getOrgInfo}></OrganizationTree>
          <div className="submit-button">搜索： <Input placeholder="品牌检索词" style={{width:'402px',marginLeft:'15px',marginRight:'20px'}} value={this.props.brandSubscibe.searchParams.keyword} onChange={this._brandNameChange}/> <Button type="danger" icon="search" onClick={this._searchButton}>检索</Button></div>
        </div>
        <div className="wrapper-box util-clearfix">
          <Spin spinning={this.props.brandSubscibe.loading} tip="Loading...">
          <div style={{paddingTop:"10px",paddingBottom:"10px", fontSize:'14px',lineHeight:"32px"}}>
              <span style={{display:"inline-block",paddingRight:"0px",lineHeight:"32px"}}>
                <label style={{display:"inline-block",paddingRight:"0px"}}>您总共可以设置<span>{this.props.brandSubscibe.brandLimimNum}</span>个品牌，</label>
              </span>
            <span style={{display:"inline-block",paddingLeft:"0px"}}>
                <label style={{display:"inline-block",paddingRight:"0px"}}>当前设置了<span>{this.props.brandSubscibe.brandNum}</span>个。</label>
            </span>
          </div>
            <div className="tag-list">
          {this.renderTagList()}
            </div>
          </Spin>
        </div>
        <AddBrand {...this.props}></AddBrand>
      </div>
    );
  }
}
//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    brandNews: state.BrandNews,
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
export default connect(mapStateToProps, mapDispatchToProps)(BrandSubscibe);
