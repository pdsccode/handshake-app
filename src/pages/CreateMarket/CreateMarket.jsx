import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './CreateMarket.scss';
import { hasEmail } from './selector';
import EmailForm from './EmailForm';
import CreateEventContainer from './CreateEventContainer';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    hasEmail: PropTypes.bool,
    match: PropTypes.object,
  };

  static defaultProps = {
    hasEmail: false,
    match: {},
  };

  renderComponent = (props) => {
    const { eventId } = props.match.params;
    return (!props.hasEmail) ? <EmailForm /> : <CreateEventContainer eventId={eventId} />;
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
