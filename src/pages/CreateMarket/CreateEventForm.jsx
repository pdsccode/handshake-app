import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import moment from 'moment';
import DatePicker from '@/components/handshakes/betting-event/Create/DatePicker/DatePicker';
import { renderField } from './form';
import { required } from './validate';

class CreateEventForm extends Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    className: PropTypes.string,
    reportList: PropTypes.array,
    isNew: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    reportList: undefined,
    isNew: true,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderGroupTitle = (title) => {
    return (<div className="CreateEventFormGroupTitle">{title}</div>);
  }

  renderGroupNote = (text) => {
    return (<div className="CreateEventFormGroupNote">{text}</div>);
  }

  renderEvent = ({ isNew}) => {
    if (!isNew) return null;
    const title = 'CREATE AN EVENT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
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

  renderOutComes = ({ fields, meta: { error }, isNew}) => {
    const title = 'OUTCOME';
    const textNote = '2.0 : Bet 1 ETH, win 1 ETH. You can adjust these odds.';
    return (
      <React.Fragment>
        { this.renderGroupTitle(title) }
        { this.renderGroupNote(textNote) }
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
        <button className="AddMoreOutCome" type="button" onClick={() => fields.push = ({})}>
          <img src={IconPlus} alt="" className="IconPlus" />
          <span>Add more outcomes</span>
        </button>
        {error && <li className="error">{error}</li>}
      </React.Fragment>
    );
  }

  renderFee = ({ isNew}) => {
    const title = 'CREATOR FEE';
    const textNote = 'The creator fee is a percentage of the total winnings of the market.';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="creatorFee"
          type="text"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          validate={[required]}
          disabled={!isNew}
        />
        {this.renderGroupNote(textNote)}
      </React.Fragment>
    );
  }

  renderReport = ({ reportList}) => {
    const title = 'REPORT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field name="reports" component="select">
          <option value="">Please select a verified source</option>
          {reportList.map(r => <option value={r.id} key={r.id}>{`${r.name} - ${r.url}`}</option>)}
        </Field>
        {/*{error && <li className="error">{error}</li>}*/}
      </React.Fragment>
    );
  }

  renderTime = ({ input, isNew}) => {
    console.log('input', input);
    // console.log('moment.unix(input.value)', moment.unix(input.value));
    return (
      <DatePicker
        onChange={(date) => { this.setFieldValueToState(date, 'closingTime'); }}
        className="form-control input-field"
        placeholder="Closing Time"
        dateFormat="DD MMMM YYYY"
        name="closingTime"
        required
        value={moment.unix(1533930785)}
        // disabled={!isNew}
      />
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(CreateEventForm.displayName, {
      [props.className]: !!props.className,
    });
    return (
      <form className={cls}>
        {this.renderEvent(props)}
        <FieldArray
          name="outcomes"
          isNew={props.isNew}
          component={this.renderOutComes}
        />
        {this.renderFee(props)}
        {this.renderReport(props)}
        {/*{renderTime()}*/}
        <Field
          name="closingTime"
          type="text"
          component={this.renderTime}
          label="Closing Time"
          validate={[required]}
          isNew={props.isNew}
        />
        <button type="submit" disabled={props.pristine || props.submitting}>
          Submit
        </button>
      </form>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default reduxForm({
  form: 'CreateEventForm',
  enableReinitialize: true,
})(CreateEventForm);
