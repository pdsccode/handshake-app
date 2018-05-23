import React from 'react';
// import Button from '@/components/core/controls/Button/Button';
// import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

class Component extends React.Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {handleSubmit} = this.props;
    const fakeValues = {
      amount: 12341234,
      total: 12341234,
      cardNumber: 12341234,
      cardExpiration: 12341234,
    }

    handleSubmit(fakeValues);
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input name='amount' type='text' placeholder='Amount' />
          <input name='total' type='text' placeholder='Total' />
          <input name='cardNumber' type='text' placeholder='Number' />
          <input name='cardExpiration' type='text' placeholder='Expiration' />
          <input name='cardCVC' type='text' placeholder='CVC' />
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    )
  }
}

export default Component;
