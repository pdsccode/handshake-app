import React from 'react';
import PropTypes from 'prop-types';

import Book from './../Book';

import "./GroupBook.scss";

class GroupBook extends React.Component {
  static propTypes = {
    bookList: PropTypes.array,
    amountColor: PropTypes.string,
  }
  static defaultProps = {
    amountColor: '#FA6B49',
  }


  constructor(props) {
    super(props);
  }

  render() {
    const {bookList, amountColor} = this.props;
    const isGotDefaultOutCome = typeof window !== 'undefined' && window.isGotDefaultOutCome;
    return (
      <div className="wrapperGroupBook">
        {
          (bookList && bookList.length > 0) ?
            bookList.map((item, index) => <Book key={index} amountColor={amountColor} item={item} />) :
            isGotDefaultOutCome ? <div className="noData">Stake a bet on new territory.</div> : ''
        }
      </div>
    );
  }
}

export default GroupBook;
