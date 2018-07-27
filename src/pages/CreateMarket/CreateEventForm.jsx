import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { renderField } from './form';
import { required } from './validate';

function renderEvent(props) {
  // if (props.selectedEvent) return null;
  return (
    <Field
      name="eventName"
      type="text"
      component={renderField}
      label="CREATE AN EVENT"
      placeholder="Event name"
      validate={[required]}
    />
  );
}

function renderOutComes({ fields, meta: { error } }) {
  return (
    <React.Fragment>
      <label>OUTCOME</label>
      <span>2.0 : Bet 1 ETH, win 1 ETH. You can adjust these odds.</span>
      <ul>
        {fields.map((outcome, index) => {
          return (
            <li key={`${outcome}.id`}>
              <Field
                name={`${outcome}.name`}
                type="text"
                component={renderField}
              />
              <button
                type="button"
                title=""
                onClick={() => fields.remove(index)}
              >
                Remove
              </button>
            </li>
          );
        })}
        {error && <li className="error">{error}</li>}
      </ul>
    </React.Fragment>
  );
}

function renderFee() {
  return (
    <React.Fragment>
      <Field
        name="creatorFee"
        type="text"
        component={renderField}
        label="CREATOR FEE"
        validate={[required]}
      />
      <span>The creator fee is a percentage of the total winnings of the market.</span>
    </React.Fragment>
  );
}

function renderReport2() {
  return (
    <React.Fragment>
      <label>Favorite Color</label>
      <div>
        <Field name="favoriteColor" component="select">
          <option value="">Select a color...</option>
          {colors.map(colorOption =>
            <option value={colorOption} key={colorOption}>{colorOption}</option>)}
        </Field>
      </div>
    </React.Fragment>
  );
}

function renderReport({ fields, meta: { error } }) {
  console.log('report', fields);
  return (
    <React.Fragment>
      <label>REPORT</label>
      <Field name="favoriteColor" component="select">
        <option value="">Please select a verified source</option>
        {fields.map(item => <option value={1} key={1}>{2}</option>)}
      </Field>
      {error && <li className="error">{error}</li>}
    </React.Fragment>
  );
}

function renderTime() {

}

let CreateEventForm = (props) => {
  const cls = classNames(CreateEventForm.displayName, {
    [props.className]: !!props.className,
  });
  console.log('props.initialValues', props.initialValues);
  return (
    <form className={cls}>
      {renderEvent(props)}
      <FieldArray name="outcomes" component={renderOutComes} />
      {renderFee()}
      <FieldArray name="reports" component={renderReport} />
      {renderTime()}
    </form>
  );
}

CreateEventForm.propTypes = {
  className: PropTypes.string,
  selectedEvent: PropTypes.object,
};

CreateEventForm.defaultProps = {
  className: '',
  selectedEvent: undefined,
};

CreateEventForm.displayName = 'CreateEventForm';

CreateEventForm = reduxForm({
  form: 'CreateEventForm',
})(CreateEventForm);

CreateEventForm = connect(
  (state, props) => {
    console.log('props', props);
    return {
      initialValues: {
        eventName: props.selectedEvent.name,
        outcomes: props.selectedEvent.outcomes,
        creatorFee: props.selectedEvent.market_fee,
      },
    };
  },
  // (state, props) => ({
  //   initialValues: {
  //     eventName: props.selectedEvent.name,
  //   },
  // }),
)(CreateEventForm);

export default CreateEventForm;
