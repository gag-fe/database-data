import React from 'react';
import Transfer from '@gag/transfer-web';
//import Transfer from '../components/transfer/src/index';
import Modal from '@gag/modal-web';
import Icon from '@gag/icon-web';
import Spin from '@gag/spin-web';
import Button from '@gag/button-web';
import Pagination from '@gag/pagination-web';
import Utils from '../../../utils/index';
const CommonUtils = Utils.common;
let CURRNET_PAGE_INDEX = 1;
class AddBrand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mockData: [],
      targetKeys: []
    };
  }

  _handleOk = () => {
    let targetKeys = this.state.targetKeys;
    if(targetKeys.length == 0){
      CommonUtils.modal('warning', '警告', '请添加关注品牌！');
      return false;
    }
    let brandIds = targetKeys.join(',');
    this.props.visibleAddBrandFn(false);
    this.props.solicitudeBrandAdd({'brandIds':brandIds});
    this.setState({
      targetKeys: []
    });
  }

  _handleCancel = () => {
    this.setState({
      targetKeys: []
    });
    this.props.visibleAddBrandFn(false);
  }

  _handleChange = (targetKeys, direction, moveKeys) => {
    this.setState({
      targetKeys
    });
  }

  //翻页
  _turnPage = (pageIndex, pageSize) => {
    let params = {};
        params['pageIndex'] = pageIndex;
        params['pageSize'] = pageSize;

    this.props.updateSearchParamsSubscibe(params);
    this.props.getBrandListDisabled();
  }

  _renderFooter = () => {
    let self = this;
    const pagination = {
      defaultCurrent: 1,
      total: self.props.brandSubscibe.searchParamsDisabled.total,
      current: self.props.brandSubscibe.searchParamsDisabled.pageIndex,
      pageSize: self.props.brandSubscibe.searchParamsDisabled.pageSize,
      onChange: self._turnPage
    };
    return (<span className="text">请精确检索您想要的品牌名称。</span>);
  }

  _onSearchChange = (direction, event) => {
    let _self =  this;
    let val = event.target.value;
    let params = {};
        params['keyword'] = val;
        params['pageIndex'] = 1;

    setTimeout(function () {
      _self.props.updateSearchParamsSubscibe(params);
      _self.props.getBrandListDisabled();
    },500);
  }

  render() {
    if(this.props.brandSubscibe.brandListDisabled.length == 0) {
      //return false;
    }

    const mockData = [];

    this.props.brandSubscibe.brandListDisabled.map((item, idx) => {
      const data = {
        key: item.brandId,
        title: item.brandName
      };
      mockData.push(data);
    });

    return (
      <div className="add-brand-list">
        <Modal
          width={900}
          title="添加关注品牌"
          visible={this.props.brandSubscibe.visibleAddBrand}
          onOk={this._handleOk}
          onCancel={this._handleCancel}
        >
          <Transfer
            className="transfer-wrap"
            titles={['未关注品牌', '关注品牌']}
            dataSource={mockData}
            showSearch
            listStyle={{
              width: 380,
              height: 580
            }}
            searchPlaceholder = "请输入品牌检索词"
            onSearchChange={this._onSearchChange}
            targetKeys={this.state.targetKeys}
            onChange={this._handleChange}
            render={item => `${item.title}`}
            footer={this._renderFooter}
          />
        </Modal>
      </div>
    );
  }
}
export default AddBrand
