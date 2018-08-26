import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { URL } from "@/constants";

class EscrowDeposit extends React.Component {
  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;

    return <div>ahihi</div>;
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(EscrowDeposit));
