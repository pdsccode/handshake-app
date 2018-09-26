import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import './CreateStoreATM.scss';
import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldPhoneInput, fieldRadioButton, fieldDaySelector } from '@/components/core/form/customField';
import { required, requiredPhone, requiredDaySelector } from '@/components/core/form/validation';
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
import { fieldTypeAtm, fieldAtmStatus, fieldTimePicker } from './reduxFormFields';
import 'rc-time-picker/assets/index.css';
import Feed from '@/components/core/presentation/Feed/Feed';

const CASH_ATM_TAB = {
  INFO: 'INFO',
  TRANSACTION: 'TRANSACTION',
};

const ATM_TYPE = {
  PERSONAL: 'personal',
  STORE: 'store',
};

const ATM_STATUS = {
  OPEN: 'open',
  CLOSE: 'close',
};

const TIME_FORMAT = 'HH:mm';

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
      selectedDay: {},
      atmType: ATM_TYPE.PERSONAL,
      atmStatus: false,
      startTime: moment('08:00', TIME_FORMAT),
      endTime: moment('17:00', TIME_FORMAT),
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = '#000000';

class Component extends React.Component {
  static propTypes = {
    // setLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      lat: 0,
      lng: 0,
      cashTab: CASH_ATM_TAB.INFO,

      cashStore: this.props.cashStore,
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { rfChange } = nextProps;
    if (JSON.stringify(nextProps.cashStore) !== JSON.stringify(prevState.cashStore)) {
      const { name, address, phone, status, business_type, information } = nextProps.cashStore;

      rfChange(nameFormExchangeCreate, 'username', name);
      rfChange(nameFormExchangeCreate, 'phone', phone);
      rfChange(nameFormExchangeCreate, 'address', address);
      rfChange(nameFormExchangeCreate, 'atmType', business_type);
      rfChange(nameFormExchangeCreate, 'atmStatus', status === ATM_STATUS.OPEN);
      rfChange(nameFormExchangeCreate, 'startTime', moment(information.open_hour, TIME_FORMAT));
      rfChange(nameFormExchangeCreate, 'endTime', moment(information.close_hour, TIME_FORMAT));
      return { cashStore: nextProps.cashStore };
    }
  }

  componentDidMount() {
    const {
      ipInfo,
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

    const { messages } = this.props.intl;
    const { cashStore } = this.props;
    const { lat, lng } = this.state;
    const { username, phone, address, atmType, atmStatus, startTime, endTime } = values;

    let data = {
      name: username,
      address,
      phone,
      business_type: atmType,
      longitude: lng,
      latitude: lat,
    };

    if (atmType === ATM_TYPE.PERSONAL) {
      data.status = atmStatus ? ATM_STATUS.OPEN : ATM_STATUS.CLOSE;
    } else if (atmType === ATM_TYPE.STORE) {
      data.information = { open_hour: startTime.format(TIME_FORMAT), close_hour: endTime.format(TIME_FORMAT) };
    }

    let message = '';
    if (cashStore) {
      message = messages.create.atm.text.confirmUpdateAtm;
    } else {
      message = messages.create.atm.text.confirmCreateAtm;
    }

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            {
              cashStore ? (
                <Button className="mt-2" block onClick={() => this.updateOffer(data)}><FormattedMessage id="ex.btn.confirm" /></Button>
              ) : (
                <Button className="mt-2" block onClick={() => this.createOffer(data)}><FormattedMessage id="ex.btn.confirm" /></Button>
              )
            }
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  createOffer = (offer) => {
    this.showLoading();
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
    this.showLoading();
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
        this.getStoreATM();
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

  onCashTabChange = (e, newValue) => {
    console.log('onTypeChange', newValue);
    this.setState({ cashTab: newValue }, () => {
    });
  }

  render() {
    const { messages } = this.props.intl;
    const {
      modalContent, cashTab,
    } = this.state;

    const { atmType } = this.props;


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
                    { value: CASH_ATM_TAB.INFO, text: messages.create.atm.tab.storeInfo, icon: null },
                    { value: CASH_ATM_TAB.TRANSACTION, text: messages.create.atm.tab.transaction, icon: null },
                  ]}
                  onChange={this.onCashTabChange}
                />
              </div>
            </div>
          </FormFilterFeeds>
        </div>

        {
          cashTab === CASH_ATM_TAB.INFO ? (
            <FormExchangeCreate onSubmit={this.onSubmit}>
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
                <div className="input-group">
                  <div className="d-table w-100">
                    <Field
                      component={fieldTypeAtm}
                      texts={messages.create.atm.text}
                      name="atmType"
                      atmType={ATM_TYPE}
                    />
                  </div>
                </div>
                {
                  atmType === ATM_TYPE.PERSONAL ? (
                    <Field
                      component={fieldAtmStatus}
                      texts={messages.create.atm.text}
                      name="atmStatus"
                    />
                  ) : (
                    <div className="input-group">
                      <div className="d-table w-100 atm-time">
                        <div className="d-table-cell w-50">
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            name="startTime"
                          />
                        </div>
                        <div className="d-table-cell w-50">
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            name="endTime"
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
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
  const atmType = selectorFormExchangeCreate(state, 'atmType');
  return {
    atmType,
    ipInfo: state.app.ipInfo,
    cashStore: state.exchange.cashStore,
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
