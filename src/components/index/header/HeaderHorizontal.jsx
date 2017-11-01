import React from 'react';
import Button from '@gag/button-web';
import Logo from './Logo';
import Navi from '../Navi';

class Header extends React.Component {

  render() {
    let name = 'unknow';
    if (this.props.user) {
      const user = this.props.user;
      var userName = user.userName;
      var userId = user.userId;
    }

    return (
            <header className="row header-horizontal">
                <Logo {...this.props} />
                <Navi {...this.props} />
                <div className="toolbox">
                    <Button type="ghost">
                        {userName} | {userId}
                    </Button>
                </div>
            </header>
        );
  }
}

module.exports = Header;
