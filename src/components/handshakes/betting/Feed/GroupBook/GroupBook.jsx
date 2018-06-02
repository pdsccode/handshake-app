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
        const {odd} = props;
        this.state = {

        };


      }

    render(){
        const {bookList, amountColor} = this.props;
        console.log('BookList:', bookList);
        return (
            <div className="wrapperGroupBook">
            {bookList&& bookList.map((item, index) =>
                <Book amountColor={amountColor} key={item.id} item={item}/>
              )}
            </div>
        );
    }
}
export default GroupBook;
