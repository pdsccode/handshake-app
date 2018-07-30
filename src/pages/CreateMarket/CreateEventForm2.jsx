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

function renderReport({ reportList }) {
  return (
    <React.Fragment>
      <label>REPORT</label>
      <Field name="reports" component="select">
        <option value="">Please select a verified source</option>
        {reportList.map(r => <option value={r.id} key={r.id}>{`${r.name} - ${r.url}`}</option>)}
      </Field>
      {/*{error && <li className="error">{error}</li>}*/}
    </React.Fragment>
  );
}

function renderTime() {

}

let CreateEventForm = (props) => {
  const cls = classNames(CreateEventForm.displayName, {
    [props.className]: !!props.className,
  });
  return (
    <form className={cls}>
      {renderEvent(props)}
      <FieldArray name="outcomes" component={renderOutComes} />
      {renderFee()}
      {renderReport(props)}
      {renderTime()}
    </form>
  );
}

CreateEventForm.propTypes = {
  className: PropTypes.string,
  selectedEvent: PropTypes.object,
  reportList: PropTypes.array,
  isNew: PropTypes.bool,
};

CreateEventForm.defaultProps = {
  className: '',
  selectedEvent: undefined,
  reportList: undefined,
  isNew: true,
};

CreateEventForm.displayName = 'CreateEventForm';

CreateEventForm = reduxForm({
  form: 'CreateEventForm',
})(CreateEventForm);

CreateEventForm = connect(
  (state, props) => {
    console.log('props', props);
    return {
      initialValues: props.isNew ? {} : {
        eventName: props.selectedEvent.name,
        outcomes: props.selectedEvent.outcomes,
        creatorFee: props.selectedEvent.market_fee,
      },
    };
  },
)(CreateEventForm);

export default CreateEventForm;
