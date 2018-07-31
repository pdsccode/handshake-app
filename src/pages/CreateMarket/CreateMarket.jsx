import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './CreateMarket.scss';
import { hasEmail } from './selector';
import EmailForm from './EmailForm';
import CreateEventContainer from './CreateEventContainer';
import { updateEmail } from './action';

import ShareMarket from './ShareMarket';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasEmail: PropTypes.bool,
  };

  static defaultProps = {
    hasEmail: false,
  };

  handleSubmit = (value) => {
    const { email } = value;
    this.props.dispatch(updateEmail(email));
  }

  renderComponent = (props) => {
    // const shareURL = 'http://localhost:8080/exchange?match=29&out_come=137&ref=1726&is_private=1';
    // return (!props.hasEmail) ? <ShareMarket shareURL={shareURL} /> : <CreateEventContainer />;
    return (!props.hasEmail) ? <EmailForm onSubmit={this.handleSubmit} /> : <CreateEventContainer />;
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
