import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './CreateMarket.scss';
import { hasEmail } from './selector';
import EmailForm from './EmailForm';
import CreateEventForm from './CreateEventForm';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    dispatch: PropTypes.func,
    hasEmail: PropTypes.bool,
  };

  static defaultProps = {
    hasEmail: false,
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   };
  // }

  renderComponent = (props, state) => {
    return (!props.hasEmail) ? <EmailForm /> : <CreateEventForm />;
  };

  render() {
    return (
      <div className={CreateMarket.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      hasEmail: hasEmail(state),
    };
  },
)(CreateMarket);
