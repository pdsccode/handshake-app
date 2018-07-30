import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { renderField } from './form';
import { required } from './validate';

function renderEvent({ isNew }) {
  if (!isNew) return null;
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

function renderOutComes({ fields, meta: { error }, isNew }) {
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
                disabled={!isNew && fields.get(index).id}
              />
              {isNew && !!index &&
              <button
                type="button"
                title=""
                onClick={() => fields.remove(index)}
              >
                Remove
              </button>}
            </li>
          );
        })}
        <button type="button" onClick={() => fields.push({})}>Add more outcomes</button>
        {error && <li className="error">{error}</li>}
      </ul>
    </React.Fragment>
  );
}

function renderFee({ isNew }) {
  return (
    <React.Fragment>
      <Field
        name="creatorFee"
        type="text"
        component={renderField}
        label="CREATOR FEE"
        validate={[required]}
        disabled={!isNew}
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
      <FieldArray
        name="outcomes"
        isNew={props.isNew}
        component={renderOutComes}
      />
      {renderFee(props)}
      {renderReport(props)}
      {renderTime()}
    </form>
  );
}

CreateEventForm.propTypes = {
  className: PropTypes.string,
  reportList: PropTypes.array,
  isNew: PropTypes.bool,
};

CreateEventForm.defaultProps = {
  className: '',
  reportList: undefined,
  isNew: true,
};

CreateEventForm.displayName = 'CreateEventForm';

export default reduxForm({
  form: 'CreateEventForm',
})(CreateEventForm);
