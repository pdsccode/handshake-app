import React from 'react';
import { Formik } from 'formik';

class CreateSeedItem extends React.Component {
  render() {
    return (
      <div>
        <h1>My Form</h1>
        <p>This can be anywhere in your application</p>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={values => {
            // same as above, but feel free to move this into a class method now.
            let errors = {};

            return errors;
          }}
          onSubmit={(values, {setSubmitting, setErrors /* setValues and other goodies */}) => {
            console.log("here");
          }}
          render={({
                     values,
                     errors,
                     touched,
                     handleChange,
                     handleBlur,
                     handleSubmit,
                     isSubmitting,
                   }) => (
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
          )}
        />
      </div>
    );
  }
}

export default CreateSeedItem;
