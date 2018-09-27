/* eslint react/prop-types:0 */
/* eslint react/sort-comp:0 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldRadioButton, fieldPhoneInput } from '@/components/core/form/customField';
import { required, requiredPhone } from '@/components/core/form/validation';
import { change, clearFields, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import COUNTRIES from '@/data/country-dial-codes.js';
import { API_URL, ATM_STATUS, ATM_TYPE, TIME_FORMAT, URL } from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { hideLoading, showAlert, showLoading, showPopupGetGPSPermission } from '@/reducers/app/action';
import { createStoreATM, getStoreATM, updateStoreATM } from '@/reducers/exchange/action';
import { getErrorMessageFromCode, getAddressFromLatLng } from '@/components/handshakes/exchange/utils';
import moment from 'moment';
import Feed from '@/components/core/presentation/Feed/Feed';
import 'rc-time-picker/assets/index.css';
import { fieldTypeAtm, fieldAtmStatus, fieldTimePicker, mapField } from './reduxFormFields';
import './CreateStoreATM.scss';
import '../styles.scss';

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
      selectedDay: {},
      atmType: ATM_TYPE.PERSONAL,
      startTime: moment('08:00', TIME_FORMAT),
      endTime: moment('17:00', TIME_FORMAT),
      atmStatus: ATM_STATUS.OPEN,
      position: { lat: 10.8086145, lng: 106.67679439999999 },
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
      showMap: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    /* eslint camelcase:0 */
    const { rfChange, position } = nextProps;
    if (position?.address && position.lat && position.lng) {
      rfChange(nameFormExchangeCreate, 'address', position?.address);
      return {
        cashStore: {
          ...nextProps.cashStore,
          address: position?.address,
        },
        lat: position?.lat,
        lng: position?.lng,
      };
    }
    return null;
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

  detectPhonePrefix = () => {
    const { rfChange, ipInfo } = this.props;
    const { cashStore } = this.state;
    // auto fill phone number from user profile
    let detectedCountryCode = '';
    const foundCountryPhone = COUNTRIES.find(
      i => i.code.toUpperCase() === ipInfo?.country?.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(
      nameFormExchangeCreate,
      'phone',
      cashStore.phone || `${detectedCountryCode}-`,
    );
  }

  onSubmit = (values) => {
    const { messages } = this.props.intl;
    const { cashStore } = this.props;
    const { lat, lng } = this.state;
    const { username, phone, address, atmType, atmStatus, startTime, endTime } = values;
    const data = {
      name: username,
      address,
      phone,
      business_type: atmType,
      longitude: lng,
      latitude: lat,
    };

    if (atmType === ATM_TYPE.PERSONAL) {
      data.status = atmStatus;
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

  onCashTabChange = (e, newValue) => {
    console.log('onTypeChange', newValue);
    this.setState({ cashTab: newValue }, () => {
    });
  }

  setAddressFromLatLng = (lat, lng, addressDefault) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    if (addressDefault) {
      setTimeout(() => {
        rfChange(nameFormExchangeCreate, 'address', addressDefault);
      }, 0);
    } else {
      getAddressFromLatLng({ lat, lng }).then(address => {
        rfChange(nameFormExchangeCreate, 'address', address);
      });
    }
  }

  getStoreATM() {
    this.props.getStoreATM({
      PATH_URL: `${API_URL.EXCHANGE.CASH_STORE_ATM}`,
      successFn: this.handleGetStoresSuccess,
      errorFn: console.warn,
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
      message: (
        <div className="text-center">
          {message}
        </div>
      ),
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
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
    // const offer = OfferShop.offerShop(responseData.data);
    // this.offer = offer;


    this.hideLoading();
    const message = <FormattedMessage id="createOfferSuccessMessage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(`${URL.HANDSHAKE_ATM}`);
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

  setAddress = (address) => {
    if (address) {
      const { rfChange } = this.props;
      rfChange(nameFormExchangeCreate, 'address', address);
    }
  }

  handleGetStoresSuccess = ({ data }) => {
    if (data) {
      /* eslint camelcase:0 */
      const { rfChange } = this.props;
      const { name, address, phone, status, business_type, information, latitude, longitude } = data;
      rfChange(nameFormExchangeCreate, 'username', name);
      rfChange(nameFormExchangeCreate, 'phone', phone);
      rfChange(nameFormExchangeCreate, 'address', address);
      rfChange(nameFormExchangeCreate, 'atmType', business_type);
      rfChange(nameFormExchangeCreate, 'atmStatus', status === ATM_STATUS.OPEN ? ATM_STATUS.OPEN : ATM_STATUS.CLOSE);
      rfChange(nameFormExchangeCreate, 'startTime', moment(information.open_hour, TIME_FORMAT));
      rfChange(nameFormExchangeCreate, 'endTime', moment(information.close_hour, TIME_FORMAT));

      if (latitude && longitude) {
        rfChange(nameFormExchangeCreate, 'position', {
          lat: latitude,
          lng: longitude,
        });
      }
      const cashStore = {
        name, phone, address, businessType: business_type, information,
      };
      this.setState({ cashStore });
      this.detectPhonePrefix();
    }
  }

  toggleGoogleMap = () => {
    this.setState(({ showMap }) => ({ showMap: !showMap }));
  }

  renderMap = () => {
    const { showMap } = this.state;
    if (!showMap) return null;
    return (
      <div className="item-info">
        <Field
          component={mapField}
          name="position"
        />
      </div>
    );
  }

  render() {
    const { messages } = this.props.intl;
    const {
      modalContent, cashTab,
    } = this.state;

    const { atmType } = this.props;

    return (
      <div>
        <div className="atm-tab-container">
          <FormFilterFeeds>
            <div>
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
                <div className="input-group item-info">
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
                    <div className="item-info">
                      <Field
                        component={fieldAtmStatus}
                        texts={messages.create.atm.text}
                        atmStatus={ATM_STATUS}
                        name="atmStatus"
                      />
                    </div>
                  ) : (
                    <div className="input-group item-info">
                      <div className="d-table w-100 atm-time">
                        <div className="d-table-cell w-50">
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            defaultTime={moment('05:00 AM', TIME_FORMAT)}
                            name="startTime"
                          />
                        </div>
                        <div className="d-table-cell w-50">
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            defaultTime={moment('08:00 PM', TIME_FORMAT)}
                            name="endTime"
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
                <div className="item-info">
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

                <div className="phone-field item-info">
                  <label className="form-control-title">{messages.create.atm.text.phone.toUpperCase()}</label>
                  <Field
                    name="phone"
                    className="form-control-custom"
                    component={fieldPhoneInput}
                    color={textColor}
                    type="tel"
                    placeholder="4995926433"
                    validate={[requiredPhone]}
                  />
                </div>

                <div className="item-info">
                  <label className="form-control-title">{messages.create.atm.text.addressTitle.toUpperCase()}</label>
                  <div>
                    <div className="address-container">
                      <Field
                        name="address"
                        type="text"
                        className="form-control form-control-input"
                        placeholder={messages.create.atm.text.addressHint}
                        component={fieldInput}
                        validate={[required]}
                      />
                      <div className={`address-update-btn ${this.state.showMap && 'close-map'}`} onClick={this.toggleGoogleMap}>
                        <span>{ this.state.showMap ? 'Close Maps' : 'Open Maps' }</span>
                      </div>
                    </div>
                    {this.renderMap()}
                  </div>
                </div>
                <Button block type="submit" className="mt-3 open-button item-info"> {
                  messages.create.atm.button.create
                }
                </Button>
              </div>
            </FormExchangeCreate>
          ) : (
            <div>Transaction</div>
          )
        }
        <ModalDialog onRef={modal => { this.modalRef = modal; }} >
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const atmType = selectorFormExchangeCreate(state, 'atmType');
  const position = selectorFormExchangeCreate(state, 'position');
  return {
    position,
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
