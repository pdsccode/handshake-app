import React from 'react';
import PropTypes from 'prop-types';

import Book from './../Book';

import "./GroupBook.scss";

class GroupBook extends React.Component {
    static propTypes = {
        bookList: PropTypes.array.isRequired
      }
    static defaultProps = {
        bookList: [ 
            {id: 1, odd: 2.3, amount: 0.1528},
            {id: 2, odd: 2.3, amount: 0.1528},
            {id: 3, odd: 1.8, amount: 1.1234},
            {id: 4, odd: 1.8, amount: 1.1234},
            {id: 5, odd: 1.8, amount: 1.1234},

        ]
    }


    constructor(props) {
        super(props);
        const {odd} = props;
        this.state = {
          
        };
    
        
      }

    render(){
        const {bookList} = this.props;
        return (
            <div className="wrapperGroupBook">
            {bookList.map((item, index) =>
                <Book/>
              )}
            </div>
        );
    }
}
export default GroupBook;