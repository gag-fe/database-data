import React from 'react';
import Radio from '@gag/radio-web';
import Menu from '@gag/menu-web';
import Button from '@gag/button-web';
import Dropdown from '@gag/dropdown-web';
import Icon from '@gag/icon-web';
import Tag from '@gag/tag-web';
import Spin from '@gag/spin-web';
const CheckableTag = Tag.CheckableTag;
const RadioGroup = Radio.Group;
const tagsFromServer = ['Movies', 'Books', 'Music', 'Sports'];
class BrandSubscrib extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  //取消订阅
  _unsubscribe(brandId, brandName){
    let item = {};
    item['brandIds'] = brandId;
    item['brandName'] = brandName;
    this.props.cancelBrand(item);
  }

  //取消订阅
  _addsubscribe(brandId, brandName){
    let item = {};
    item['brandIds'] = brandId;
    item['brandName'] = brandName;
    this.props.solicitudeBrand(item);
  }

  //取消订阅
  _searchBrand(brandId, brandName){
    let item = {};
    item['brandIds'] = brandId;
    item['brandName'] = brandName;
    item['pageIndex'] = 1;
    this.props.updateSearchParams(item);
    this.props.getBrandNewsList();
  }

  _rederTagList(){
    let html = [];
    let item = this.props;
      if(item.status != 0){
        html.push(<span className="tag-warp current"><label>{item.brand}</label><div className="layer-button"><Button type="dashed" icon="minus" size="small" onClick={this._unsubscribe.bind(this,item.brandId, item.brand)}>取消关注</Button><Button type="dashed" icon="search" size="small" onClick={this._searchBrand.bind(this,item.brandId, item.brand)}>检索品牌</Button></div></span>);
      }else {
        html.push(<span className="tag-warp"><label>{item.brand}</label><div className="layer-button"><Button type="dashed" icon="plus" size="small" onClick={this._addsubscribe.bind(this,item.brandId, item.brand)}>添加关注</Button><Button type="dashed" icon="search" size="small" onClick={this._searchBrand.bind(this,item.brandId, item.brand)}>检索品牌</Button></div></span>);
      }
    return html;
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div className="brand-subscrib">
        <div className="property-label">
          <label>品牌标签：</label>{this._rederTagList()}
        </div>
      </div>
    );
  }
}
export default BrandSubscrib
