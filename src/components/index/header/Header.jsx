import React from 'react';
import Button from '@gag/button-web';
import Logo from './Logo';
import Breadcrumb from '@gag/breadcrumb-web';
import Icon from '@gag/icon-web';

class Header extends React.Component {
  render() {
    let name = 'unknow';
    if (this.props.user) {
      const user = this.props.user;
      var userName = user.userName;
      var userId = user.userId;
    }
    return (
        <header className="row header">
            <div className="toolbox">
                <Button type="ghost">
                    {userName}
                </Button>
            </div>
        </header>
      );
  }
}

module.exports = { Toolbar: Header, Logo };
