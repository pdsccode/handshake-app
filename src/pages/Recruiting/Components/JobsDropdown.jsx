import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import {
  fieldDropdown,
} from '@/components/core/form/customField';
import $http from '@/services/api';
import {required} from '@/components/core/form/validation';

import { Field } from 'redux-form';

class JobsDropdown extends React.Component {

  state = {
    jobs: []
  }

  componentDidMount() {
    $http({
      method: 'GET',
      url: 'https://www.autonomous.ai/api-v2/job-api/categories',
    })
      .then(res => {
        this.setState({
          jobs: res.data.data.map(item => ({ ...item, text: item.name })),
        });
      })
      .catch(err => console.log('err get categories', err));
  }

  render() {

    const { jobs } = this.state;

    return (
      <div>
        <Field
          name="jobName"
          component={fieldDropdown}
          defaultText={
            <FormattedMessage id="landing_page.recruiting.referFriend.label.jobPosition" />
          }
          classNameDropdownToggle="dropdown-sort w-100 bg-white"
          classNameWrapper="btn-block d-inline-block"
          list={jobs}
          validate={[required]}
        />
      </div>
    )
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(JobsDropdown));
