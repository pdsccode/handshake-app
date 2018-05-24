import React from 'react';
import {Formik} from 'formik';

class CreateSeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  onSubmit(values, {setSubmitting, setErrors /* setValues and other goodies */}) {
    console.log("here");
  }

  validateForm(values) {
    // same as above, but feel free to move this into a class method now.
    let errors = {};
    return errors;
  }

  renderForm({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
        />
        {touched.email && errors.email && <div>{errors.email}</div>}
        <input
          type="password"
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
        />
        {touched.password && errors.password && <div>{errors.password}</div>}
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    );
  }

  render() {
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validate={this.validateForm}
        onSubmit={this.onSubmit}
        render={this.renderForm}
      />
    );
  }
}

export default CreateSeedItem;
