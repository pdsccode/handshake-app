import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import './CreateStoreATM.scss';
import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldPhoneInput, fieldRadioButton } from '@/components/core/form/customField';
import { required, requiredPhone } from '@/components/core/form/validation';
import { change, clearFields, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';

import { validate } from './validation';
import '../styles.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { hideLoading, showAlert, showLoading, showPopupGetGPSPermission } from '@/reducers/app/action';
import { createStoreATM, getStoreATM, updateStoreATM } from '@/reducers/exchange/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import axios from 'axios';
import Switch from '@/components/core/controls/Switch/Switch';
import Checkbox from '@/components/core/forms/Checkbox/Checkbox';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

const CASH_ATM_TAB = {
  INFO: 'INFO',
  TRANSACTION: 'TRANSACTION',
};

const nameFormFilterFeeds = 'formFilterFeeds';
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds,
    initialValues: {
      'cash-show-type': CASH_ATM_TAB.INFO,
    },
  },
});

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = '#000000';

const languages = ["English", "German", "French", "Spanish", "Mandarin", "Tamil"];

class Component extends React.Component {
  static propTypes = {
    // setLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const isUpdate = false;

    this.state = {
      modalContent: '',
      lat: 0,
      lng: 0,
      isUpdate,
      cashTab: CASH_ATM_TAB.INFO,
      atmType: true,
      atmStatus: false,
      startTime: '08:00 am',
      endTime: '17:00 pm',
    };
  }

  setAddressFromLatLng = (lat, lng, addressDefault) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    if (addressDefault) {
      setTimeout(() => {
        rfChange(nameFormExchangeCreate, 'address', addressDefault);
      }, 0);
    } else {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
        const address = response.data.results[0] && response.data.results[0].formatted_address;
        rfChange(nameFormExchangeCreate, 'address', address);
      });
    }
  }

  componentDidMount() {
    const {
      ipInfo, rfChange, authProfile, freeStartInfo, isChooseFreeStart, getUserLocation,
    } = this.props;
    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude, ipInfo?.addressDefault);

    // show popup to get GPS permission
    this.props.showPopupGetGPSPermission();

    this.getStoreATM();
  }

  getStoreATM() {
    this.props.getStoreATM({
      PATH_URL: `${API_URL.EXCHANGE.CASH_STORE_ATM}`,
      successFn: this.handleGetOfferStoresSuccess,
      errorFn: this.handleGetOfferStoresFailed,
    });
  }

  showLoading = () => {
    // this.props.setLoading(true);
    this.props.showLoading();
  }

  hideLoading = () => {
    // this.props.setLoading(false);
    this.props.hideLoading();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  onSubmit = (values) => {
    console.log('onSubmit', values);
    console.log('state', this.state);

    const { messages } = this.props.intl;

    const data = {
      name: 'Hey hey',
      address: '123 Abc street',
      phone: '1234567890',
      business_type: 'personal',
      status: 'open',
      center: 'abcdef',
      information: { open_hour: '7 AM', close_hour: '8 PM' },
      longitude: 1,
      latitude: 2,
    };

    // this.createOffer(data);
    this.updateOffer(data);
  }

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  updateOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'PUT',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  handleCreateOfferSuccess = async (responseData) => {
    console.log('handleCreateOfferSuccess', responseData);
    const { rfChange, currency, amountSell } = this.props;
    // const offer = OfferShop.offerShop(responseData.data);
    // this.offer = offer;


    this.hideLoading();
    const message = <FormattedMessage id="createOfferSuccessMessage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.gotoUserDashBoard();
      },
    });
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  handleValidate = values => {
    const { isUpdate } = this.state;
    return validate(values, isUpdate);
  }

  onCashTabChange = (e, newValue) => {
    console.log('onTypeChange', newValue);
    this.setState({ cashTab: newValue }, () => {
    });
  }

  onChangeTypeAtm = () => {
    this.setState({ atmType: !this.state.atmType });
  }

  changeAtmStatus = (isChecked) => {
    this.setState({ atmStatus: isChecked });
  }

  onChange = (value) => {
    const format = 'h:mm a';
    console.log(value && value.format(format));
  }

  render() {
    const { messages } = this.props.intl;
    const {
      modalContent, cashTab, atmType,
    } = this.state;

    const format = 'h:mm a';

    const now = moment().hour(0).minute(0);


    return (
      <div>
        <div className="mt-2 mb-1">
          <FormFilterFeeds>
            <div>
              <hr style={{ margin: '10px 0 5px' }} />
              <div>
                <Field
                  name="cash-show-type"
                  component={fieldRadioButton}
                  type="tab-6"
                  list={[
                    { value: CASH_ATM_TAB.INFO, text: messages.create.atm.tab.storeInfo, icon: <span className="icon-dashboard align-middle" /> },
                    { value: CASH_ATM_TAB.TRANSACTION, text: messages.create.atm.tab.transaction, icon: <span className="icon-transactions align-middle" /> },
                  ]}
                  // validate={[required]}
                  onChange={this.onCashTabChange}
                />
              </div>
            </div>
          </FormFilterFeeds>
        </div>

        {
          cashTab === CASH_ATM_TAB.INFO ? (
            <FormExchangeCreate onSubmit={this.onSubmit} validate={this.handleValidate}>
              <div className="create-store-atm">
                <div>
                  <label className="form-control-title">{messages.create.atm.text.nameTitle.toUpperCase()}</label>
                  <div >
                    <Field
                      name="username"
                      type="text"
                      className="form-control form-control-input"
                      placeholder={messages.create.atm.text.nameHint}
                      component={fieldInput}
                      validate={[required]}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-control-title">{messages.create.atm.text.phone.toUpperCase()}</label>
                  <div className="input-group w-100">
                    <Field
                      name="phone"
                      className="form-control-custom w-100"
                      component={fieldPhoneInput}
                      color={textColor}
                      type="tel"
                      placeholder="4995926433"
                      // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                      validate={[requiredPhone]}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-control-title">{messages.create.atm.text.addressTitle.toUpperCase()}</label>
                  <div >
                    <Field
                      name="address"
                      type="text"
                      className="form-control form-control-input"
                      placeholder={messages.create.atm.text.addressHint}
                      component={fieldInput}
                      validate={[required]}
                    />
                  </div>
                </div>
                <div className="atm-status">
                  <div className="d-table w-100">
                    <div className="d-table-cell title">
                      {messages.create.atm.text.statusTitle}
                    </div>
                    <div className="d-table-cell text-right value">
                      <Switch isChecked={false} onChange={(isChecked) => { this.changeAtmStatus(isChecked); }} />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <div className="d-table w-100">
                    <div className="d-table-cell w-50">
                      <Checkbox name="personalAtm" checked={atmType} label={messages.create.atm.text.personalAtm} onClick={this.onChangeTypeAtm} />
                    </div>
                    <div className="d-table-cell w-50">
                      <Checkbox name="storeAtm" checked={!atmType} label={messages.create.atm.text.storeAtm} onClick={this.onChangeTypeAtm} />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <div className="d-table w-100 atm-time">
                    <div className="d-table-cell w-50">
                      <label className="form-control-title">{messages.create.atm.text.open.toUpperCase()}</label>
                      <TimePicker
                        name="startTime"
                        showSecond={false}
                        defaultValue={now}
                        className="xxx"
                        onChange={this.onChange}
                        format={format}
                        use12Hours
                        inputReadOnly
                      />
                    </div>
                    <div className="d-table-cell w-50">
                      <label className="form-control-title">{messages.create.atm.text.closed.toUpperCase()}</label>
                      <TimePicker
                        name="endTime"
                        showSecond={false}
                        defaultValue={now}
                        className="xxx"
                        onChange={this.onChange}
                        format={format}
                        use12Hours
                        inputReadOnly
                      />
                    </div>
                  </div>
                </div>

                <Button block type="submit" className="mt-3 open-button"> {
                  messages.create.atm.button.save
                }
                </Button>
              </div>
            </FormExchangeCreate>
          ) : (
            <div>Transaction</div>
          )
        }
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const phone = selectorFormExchangeCreate(state, 'phone');
  const address = selectorFormExchangeCreate(state, 'address');
  const username = selectorFormExchangeCreate(state, 'username');

  return {
    phone,
    address,
    username,
    ipInfo: state.app.ipInfo,

  };
};

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),

  createStoreATM: bindActionCreators(createStoreATM, dispatch),
  getStoreATM: bindActionCreators(getStoreATM, dispatch),
  updateStoreATM: bindActionCreators(updateStoreATM, dispatch),
  showPopupGetGPSPermission: bindActionCreators(showPopupGetGPSPermission, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
