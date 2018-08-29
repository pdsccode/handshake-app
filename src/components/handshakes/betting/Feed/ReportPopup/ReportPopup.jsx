import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  URL,
} from '@/constants';
import './ReportPopup.scss';

class ReportPopup extends React.Component {
  render() {
    return (
      <div className="ex-sticky-report">
        <div className="mb-2">You had a private event.</div>
        {/*<div className="mb-2">Tell us what happened?</div>*/}
        <div>
          <Link to={{ pathname: URL.REPORT }}>
            <button className="btn btn-report">FILL US IN</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ReportPopup;

