import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TreeSelect from '@gag/tree-select-web';
import Store from 'Store2';
import './index.less';
import * as OrgActions from '../../../actions/index.js';
import PropTypes from 'prop-types';
const TreeNode = TreeSelect.TreeNode;

class SearchTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shopName:props ? props.shopName :'',
      shopId: props ? props.shopId :'',
      searchValue: '',
    };
  }

  onChange = (value, label, extra) => {

    if (!value) {
      return false
    }

    const {store} = this.context;
    const item = {};

    item['shopName'] = label[0];
    item['shopId'] = value;

    this.setState({
      shopName: label[0],
      shopId: value
    });

    this.props.updataOrg(item);
    this.props.setUpdataOrg(item);
    if(this.props.callback && typeof(this.props.callback)=="function"){
      this.props.callback(item);
    }

    window.APP_CONFIG = Object.assign(window.APP_CONFIG, item);
  }

  filterTreeNode = (inputValue, treeNode) => {
    inputValue = inputValue || ' ';
    if (inputValue.trim() != '') {
      return treeNode.props.text.toLowerCase().indexOf(inputValue.trim().toLowerCase()) != -1 ? true : false;
    } else {
      return true;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shopName || nextProps.shopId) {
      this.setState({
        shopName: nextProps.shopName,
        shopId: nextProps.shopId
      });
    }
  }

  onSearch = (value) => {
    this.setState({searchValue: value});
  }

  render() {
    let {orgList} = this.props;
    let {searchValue} = this.state;
    const loop = data => data.map((item) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <strong>{searchValue}</strong>
          {afterStr}
        </span>
      ) : item.name;
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} value={item.id} text={item.name} disabled={item.isEmpty == 1} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} value={item.id} text={item.name} disabled={item.isEmpty == 1} title={title}/>;
    });

    return (

      <div className="search-tree-wrap">
        <div className="label-name" style={{marginRight: 20}}>机构：</div>
        <TreeSelect
          showLine
          showSearch
          allowClear={true}
          onSearch={this.onSearch}
          style={{width: 400}}
          value={this.state.shopName}
          dropdownStyle={{maxHeight: 450, overflow: 'auto'}}
          searchPlaceholder="机构名称"
          treeNodeLabelProp='text'
          treeNodeFilterProp='text'
          treeDefaultExpandAll
          onChange={this.onChange}
          filterTreeNode={this.filterTreeNode}
        >
          {loop(orgList)}
        </TreeSelect>

      </div>

    );
  }

  componentWillMount() {
    this.props.getOrgList();
  }
}
SearchTree.defaultProps = {
  orgList: [],
};

SearchTree.propTypes = {
  orgList: PropTypes.array,
};

SearchTree.contextTypes = {
  store: PropTypes.object,
};
//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    orgList: state.org.orgList,
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(OrgActions, dispatch);
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(SearchTree)
