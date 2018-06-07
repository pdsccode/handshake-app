import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import CheckedSVG from '@/assets/images/icon/checked.svg';
import CloseSVG from '@/assets/images/icon/close.svg';
import Image from '@/components/core/presentation/Image';
import { submitEmail, authUpdate } from '@/reducers/auth/action';
import { APP, URL } from '@/constants';
import local from '@/services/localStore';
import qs from 'querystring';
import Loading from '@/components/core/presentation/Loading';
import './VerifyEmail.scss';

class VerifyEmail extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    authUpdate: PropTypes.func.isRequired,
    submitEmail: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: '',
    };
    if (this.props.location.search) {
      this.state.token = qs.parse(this.props.location.search)['?token'];
    }
  }

  componentWillMount() {
    const email = local.get(APP.EMAIL_NEED_VERIFY);
    if (this.state.token && email) {
      this.props.submitEmail({
        PATH_URL: `user/verification/email/check`,
        qs: {
          email,
          token: this.state.token,
        },
        METHOD: 'POST',
        successFn: (data) => {
          if (data.status) {
            const params = new URLSearchParams();
            params.append('email', email);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {
                this.setState({ isLoading: false, isSuccess: true });
              },
              errorFn: () => {
                this.setState({ isLoading: false, isError: true, message: 'Can\'t update your email' });
              },
            });
          } else {
            this.setState({ isLoading: false, isError: true, message: 'Can\'t update your email' });
          }
        },
        errorFn: () => {
          this.setState({ isLoading: false, isError: true, message: 'Can\'t verify your email' });
        },
      });
    } else {
      this.setState({ isLoading: false, isError: true, message: 'Please check your verify url' });
    }
  }

  render() {
    if (this.state.isLoading) return <Loading message="Checking your email's verify url" />;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            {
              this.state.isSuccess ? (
                <div className="verify-block">
                  <Image src={CheckedSVG} alt="checked" />
                  <p className="title">Successed!</p>
                  <p>Your email is verified</p>
                  <p><strong><Link to={URL.HANDSHAKE_DISCOVER_INDEX}>Back to Discover</Link></strong></p>
                </div>
              ) : ''
            }
            {
              this.state.isError ? (
                <div className="verify-block">
                  <Image src={CloseSVG} alt="closed" />
                  <p className="title">Have something wrong!</p>
                  <p>{this.state.message}</p>
                  <p>Please check your email again or</p>
                  <p><strong><Link to={URL.HANDSHAKE_DISCOVER_INDEX}>Back to Discover</Link></strong></p>
                </div>
              ) : ''
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(null, ({
  submitEmail,
  authUpdate,
}))(VerifyEmail);
