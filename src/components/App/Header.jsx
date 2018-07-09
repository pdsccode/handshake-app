import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
<<<<<<< HEAD:src/components/Header/MainHeader.jsx
=======
import cn from '@sindresorhus/class-names';

>>>>>>> 355fab27c13871578dfca4126dd464fd2ee9d3d3:src/components/App/Header.jsx
import { history } from '@/stores';
import backBtn from '@/assets/images/icon/header-back.svg.raw';
import { clickHeaderBack } from '@/reducers/app/action';

<<<<<<< HEAD:src/components/Header/MainHeader.jsx
class MainHeader extends React.Component {
=======
class Header extends React.Component {
>>>>>>> 355fab27c13871578dfca4126dd464fd2ee9d3d3:src/components/App/Header.jsx
  static propTypes = {
    app: PropTypes.object.isRequired,
    clickHeaderBack: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.back = ::this.back;
  }

  back(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.props.clickHeaderBack();
        history.goBack();
      }
    } else {
      this.props.clickHeaderBack();
      history.goBack();
    }
  }

  render() {
    if (this.props.app.showHeader) {
      return (
        <header className="app-header">
          {
            this.props.app.headerLeftContent
            ? (
              <div className="app-header-left">
                {this.props.app.headerLeftContent}
              </div>
            )
            : (
              <div
                tabIndex={0}
                role="button"
                className={cn('app-header-back-btn', { visibled: this.props.app.headerBack })}
                onClick={this.back}
                onKeyDown={this.back}
                dangerouslySetInnerHTML={{ __html: backBtn }}
              />
            )
          }
          <div className="app-header-title">{this.props.app.headerTitle}</div>
          <div className="app-header-right">
            {this.props.app.headerRightContent}
          </div>
        </header>
      );
    }
    return null;
  }
}

export default connect(state => ({ app: state.app }), ({ clickHeaderBack }))(Header);
