import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change, Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import './NavBar.scss'
import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';

const nameFormFilterStation = 'formFilterStation';
const FormFilterStation = createForm({
  propsReduxForm: {
    form: nameFormFilterStation,
    initialValues: {
      type: 'buy',
      coin: { id: 'btc', text: <span><img src={iconBtc} width={25} /> BTC</span> },
    },
  },
});

class NavBar extends React.Component {



  render() {
    return (
      <div className="cash-nav-bar">
        <FormFilterStation>
          <button type="button" className="btn bg-transparent mr-2" onClick={() => console.log('clickmenu')}>☰</button>
          <span className="mr-2">I WANT TO</span>
          <div className="d-inline-block mr-1">
            <Field
              name="type"
              component={fieldRadioButton}
              type="tab-7"
              list={[
                { value: 'buy', text: 'BUY', bgColorActive: '#4CD964' },
                { value: 'sell', text: 'SELL', bgColorActive: '#F86C4F' },
              ]}
              // validate={[required]}
            />
          </div>
          <div className="d-inline-block">
            <Field
              name="coin"
              component={fieldDropdown}
              classNameWrapper=""
              defaultText="Coin"
              classNameDropdownToggle="bg-white border-0"
              // classNameDropdownToggle={`dropdown-sort bg-white ${sortIndexActive === CASH_SORTING_CRITERIA.PRICE ? 'dropdown-sort-selected' : ''}  `}
              list={[
                { id: 'btc', text: <span><img src={iconBtc} width={25} /> BTC</span> },
                { id: 'eth', text: <span><img src={iconEth} width={25} /> ETH</span> },
              ]}
            />
          </div>

        </FormFilterStation>
      </div>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(NavBar));
