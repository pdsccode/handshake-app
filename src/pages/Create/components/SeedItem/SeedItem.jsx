import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import loading from '@/assets/images/icon/loading.svg.raw';
// style
import './Button.scss';

class SeedItem extends React.Component {

  render() {
    return (
      <form>
        <input type="text" placeholder="ProjectName" />
      </form>
    );
  }
}

export default SeedItem;
