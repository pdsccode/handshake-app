import React from 'react';
import { Formik } from 'formik';
import InputField from './../InputField';

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
        <InputField
          id="project-name"
          type="text"
          label="Project name:"
          placeHolder="E.g Oscar"
          error={touched.projectName && errors.projectName}
        />
        <InputField
          id="fund-goal"
          type="text"
          label="Funding goal"
          placeHolder="1.05"
          error={touched.projectName && errors.projectName}
        />
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
