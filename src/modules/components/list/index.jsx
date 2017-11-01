import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './List.less';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selItem: props.selItem,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.listData !== this.props.listData) {
      this.setState({
        selItem: nextProps.selItem,
      });
    }
  }
  onClick = (dataItem) => {
    this.setState({
      selItem: dataItem,
    });
    if (this.props.onSel) {
      this.props.onSel(dataItem);
    }
  }
  render() {
    const { subMenuPrefixCls, radioPrefixCls, listData } = this.props;
    const { selItem } = this.state;
    //const selected = dataItem => selItem.value === dataItem.value;
    var selected = function selected(dataItem) {
      return selItem.shopEntityId === dataItem.shopEntityId;
    };
    return (
      <div className={classNames({[`${radioPrefixCls}-body`]: true})}>
        {listData.map((dataItem, index) => {
          return <div
            onClick={() => this.onClick(dataItem)}
            className={classNames({
              [`${radioPrefixCls}-item`]: true,
              [`${subMenuPrefixCls}-item-selected`]: selected(dataItem),
              [`${subMenuPrefixCls}-item-disabled`]: dataItem.disabled,
            })}
            key={index}
          >
            {dataItem.shopEntityName}
            <span className="am-radio-inner"></span>
          </div>
        })}
      </div>
    );
  }
}
List.defaultProps = {
  subMenuPrefixCls: 'am-sub-menu',
  radioPrefixCls: 'list-radio',
  listData: [],
  level: 2,
  onChange: () => {},
};
List.propTypes = {
  /** web only */
  prefixCls: PropTypes.string,
  subMenuPrefixCls: PropTypes.string,
  radioPrefixCls: PropTypes.string,
  className: PropTypes.string,
  listData: PropTypes.array,
};
List.displayName = "List";
module.exports=List;
