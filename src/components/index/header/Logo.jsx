import React from 'react';
import { Link } from 'react-router';

class Logo extends React.Component {
  render() {
    return (
            <div className="logo"><a href={this.props.href}><h1>{this.props.name}</h1></a></div>
        );
  }
}

module.exports = Logo;
