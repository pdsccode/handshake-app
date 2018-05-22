import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import Input from '@/components/Input/Input';
import AppField from '@/components/Field/AppField';
import AppForm from '@/components/Form/AppForm';
import Button from '@/components/Button/Button';
import Error from '@/components/Error/Error';
import valid from '@/services/validate';

import { signUp } from '@/reducers/auth/action';
import { showLoading, hideLoading } from '@/reducers/app/action';

import { AUTH, URL } from '@/config';

class SignUp extends React.PureComponent {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    location: PropTypes.object,
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.signUp = ::this.signUp;
    this.state = { error: '' };
  }

  signUp(values) {
    this.setState({ error: '' });
    const account = {
      email: values.email,
      password: values.password,
    };
    this.props.signUp({ data: account, more: { kind: AUTH.BUSINESS } }, () => {
      this.props.history.push(this.props.location?.state?.from?.pathname || URL.BUSINESS.INDEX);
    }, (e) => {
      this.setState({ error: e?.response?.data?.message || '' });
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="logo">Autonomous</div>
        <h1 className="header">Sign up to Capital</h1>

        <div className="right">
          <div className="form-container">

            <Form
              onSubmit={this.signUp}
              render={({ handleSubmit, focus }) => {
                return (
                  <AppForm handleSubmit={handleSubmit}>

                    <Field name="email" validate={valid.merge(valid.required, valid.email)}>
                      {({ input, meta }) => (
                        <AppField>
                          <label>Email address</label>
                          <Input {...input} meta={meta} checkError={meta.touched} placeholder="Enter you email address"/>
                          <Error show={meta.touched} error={valid.text(meta.error, 'Email')}/>
                        </AppField>
                      )}
                    </Field>

                    <Field name="password" validate={valid.required}>
                      {({ input, meta }) => (
                        <AppField>
                          <label>Password</label>
                          <Input
                            {...input}
                            meta={meta}
                            checkError={meta.touched}
                            type="password"
                            placeholder="Enter your password"
                            onRef={(input) => this.passwordElement = input}
                          />
                          <Error show={meta.touched} error={valid.text(meta.error, 'Password')} />
                        </AppField>
                      )}
                    </Field>

                    <Field name="confirm-password" validate={valid.merge(valid.required, valid.confirm_password(this.passwordElement?.value || ''))}>
                      {({ input, meta }) => (
                        <AppField>
                          <label>Confirm your password</label>
                          <Input {...input} meta={meta} checkError={meta.touched} type="password" placeholder="Confirm your password"/>
                          <Error show={meta.touched} error={valid.text(meta.error, 'Confirm your password')}/>
                        </AppField>
                      )}
                    </Field>

                    <Error show={!!this.state.error} error={this.state.error} />

                    <Button block cssType="primary" type="submit">Sign up</Button>
                  </AppForm>
                );
              }}
            />

            <div className="auth-swap">
              Already have an account? <Link to={URL.BUSINESS.SIGN_IN}>Sign in</Link>
            </div>
            <div className="copyright">© 2018 Autonomous. All rights reserved.</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapState = (state) => ({
  auth: state.auth,
});

const mapDispatch = {
  signUp,
  showLoading,
  hideLoading,
};

export default connect(mapState, mapDispatch)(SignUp);
