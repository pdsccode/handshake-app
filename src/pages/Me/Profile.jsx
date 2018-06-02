import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types'; action, mock import { API_URL,
// HANDSHAKE_STATUS_NAME, HANDSHAKE_ID } from '@/constants'; componentimport
// services
import createForm from '@/components/core/form/createForm';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import { Field } from 'redux-form';
import { fieldCleave } from '@/components/core/form/customField';
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.pt';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import './Profile.scss';

const NumberPhoneForm = createForm({
  propsReduxForm: {
    form: 'NumberPhoneForm',
  },
});

class Profile extends React.Component {
  render() {
    return (
      <Grid className="profile">
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head">
                <p className="label">Phone Number</p>
                <div className="extend">
                  <Image src={ExpandArrowSVG} alt="arrow"/>
                </div>
              </div>
              <div className="content">
                <p>In order to protect the security of your account, please add your phone number.</p>
                <p>Enter phone number</p>
                <NumberPhoneForm>
                  <Field
                    name="phone-number" 
                    className='form-control-custom form-control-custom-ex w-100'
                    component={fieldCleave}
                    propsCleave={{
                      phone: true,
                      phoneRegionCode: 'AU',
                      options: { delimiter: '-' },
                    }}
                  />
                  <Button>Send</Button>
                  <p>Enter vertiifycation code to your phone</p>
                  <Field
                    name="sms-code"
                    className='form-control-custom form-control-custom-ex w-100'
                    component={fieldCleave}
                    propsCleave={{
                      options: { numeral: true },
                    }}
                  />
                  <Button>Vertify your number</Button>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head">
                <p className="label">Email Verification</p>
                <div className="extend">
                  <Image src={ExpandArrowSVG} alt="arrow"/>
                </div>
              </div>
              <div className="content">
                <p>In order to protect the security of your account, please add your email.</p>
                <p>Enter your email</p>
                <NumberPhoneForm>
                  <Field
                    name="phone-number" 
                    className='form-control-custom form-control-custom-ex w-100'
                    component={fieldCleave}
                    propsCleave={{
                      phone: true,
                      phoneRegionCode: 'AU',
                      options: { delimiter: '-' },
                    }}
                  />
                  <Button>Vertify your email</Button>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Profile.propTypes = {
  //   me: PropTypes.object.isRequired,   loadMyHandshakeList:
  // PropTypes.func.isRequired,
};

const mapState = state => ({});

const mapDispatch = ({});

export default connect(mapState, mapDispatch)(Profile);
