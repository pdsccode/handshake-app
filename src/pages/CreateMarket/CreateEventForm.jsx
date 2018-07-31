import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import { renderField } from './form';
import { required } from './validate';

function renderGroupTitle(title) {
  return (<div className="CreateEventFormGroupTitle">{title}</div>);
}

function renderGroupNote(text) {
  return (<div className="CreateEventFormGroupNote">{text}</div>);
}

function renderEvent({ isNew }) {
  if (!isNew) return null;
  const title = 'CREATE AN EVENT';
  return (
    <React.Fragment>
      {renderGroupTitle(title)}
      <Field
        name="eventName"
        type="text"
        className="form-group"
        fieldClass="form-control"
        component={renderField}
        placeholder="Event name"
        validate={[required]}
      />
    </React.Fragment>
  );
}

function renderOutComes({ fields, meta: { error }, isNew }) {
  const title = 'OUTCOME';
  const textNote = '2.0 : Bet 1 ETH, win 1 ETH. You can adjust these odds.';
  return (
    <React.Fragment>
      { renderGroupTitle(title) }
      { renderGroupNote(textNote) }
      {
        fields.map((outcome, index) => {
          return (
            <div className="form-group-custom" key={`${outcome}.id`}>
              <Field
                name={`${outcome}.name`}
                type="text"
                className="form-group"
                fieldClass="form-control"
                component={renderField}
                disabled={!isNew && fields.get(index).id}
              />
              {isNew && !!index &&
              <button
                type="button"
                className="trash"
                onClick={() => fields.remove(index)}
              >
                <img src={IconTrash} alt="" />
              </button>}
            </div>
          );
        })
      }
      <button className="AddMoreOutCome" type="button" onClick={() => fields.push({})}>
        <img src={IconPlus} alt="" className="IconPlus" />
        <span>Add more outcomes</span>
      </button>
      {error && <li className="error">{error}</li>}
    </React.Fragment>
  );
}

function renderFee({ isNew }) {
  const title = 'CREATOR FEE';
  const textNote = 'The creator fee is a percentage of the total winnings of the market.';
  return (
    <React.Fragment>
      {renderGroupTitle(title)}
      <Field
        name="creatorFee"
        type="text"
        className="form-group"
        fieldClass="form-control"
        component={renderField}
        validate={[required]}
        disabled={!isNew}
      />
      {renderGroupNote(textNote)}
    </React.Fragment>
  );
}

function renderReport({ reportList }) {
  const title = 'REPORT';
  return (
    <React.Fragment>
      {renderGroupTitle(title)}
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

const CreateEventForm = (props) => {
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
};

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
