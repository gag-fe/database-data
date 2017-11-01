import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@gag/icon-web';
import Input from '@gag/input-web';

class Search extends React.Component{
  handleChange = (e) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(e);
    }
  }

  handleClear = (e) => {
    e.preventDefault();

    const handleClear = this.props.handleClear;
    if (handleClear) {
      handleClear(e);
    }
  }

  render() {
    const { placeholder, value, prefixCls } = this.props;
    const icon = (value && value.length > 0) ? (
      <a href="#" className={`${prefixCls}-action`} onClick={this.handleClear}>
        <Icon type="cross-circle" />
      </a>
    ) : (
      <span className={`${prefixCls}-action`}><Icon type="search" /></span>
    );

    return (
      <div>
        <Input
          placeholder={placeholder}
          className={prefixCls}
          value={value}
          ref="input"
          onChange={this.handleChange}
        />
        {icon}
      </div>
    );
  }
}
Search.defaultProps = {
  placeholder: '',
};
Search.propTypes = {
  prefixCls: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  handleClear: PropTypes.func,
  value: PropTypes.any,
};
Search.displayName = "Search";
module.exports=Search;
