import React from 'react';
import PropTypes from 'prop-types';
// component
import Button from '@/components/core/controls/Button/Button';
// style
import './Review.scss';
import createForm from '@/components/core/form/createForm';
import { Field, formValueSelector } from 'redux-form';
import { required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import { FormattedMessage } from 'react-intl';

const LENGTH = 5;

const nameReviewForm = 'reviewForm';
const ReviewCrypto = createForm({
  propsReduxForm: {
    form: nameReviewForm,
    initialValues: {

    },
  },
});
const selectorFormReview = formValueSelector(nameReviewForm);

const textColor = '#000000';

class Rate extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.starNum = props.starNum || LENGTH;
    // bind
  }

  // open() {
  //   this.ratingRef.style.display = 'flex';
  // }
  //
  // close() {
  //   this.ratingRef.style.display = 'none';
  // }

  // ratingClick(num) {
  //   this.props.hasOwnProperty('ratingOnClick') && this.props.ratingOnClick(this.starNum - num);
  // }

  componentDidMount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  render() {
    const { className, onSubmit, title, description } = this.props;
    return (
      <ReviewCrypto >
        <p className="title">{title}</p>
        <p className="description">{description}</p>
        <div className="d-flex mt-2">
          <label className="col-form-label mr-auto label-create"><span
            className="align-middle"
          ><FormattedMessage id="ex.create.label.phone" />
                                                                 </span>
          </label>
          <div className="input-group w-100">
            <Field
              name="phone"
              className="form-control-custom form-control-custom-ex w-100 input-no-border"
              component={fieldInput}
              color={textColor}
              type="tel"
              placeholder="your review"
              // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
              validate={[required]}
            />
          </div>
        </div>
        <Button block onClick={onSubmit}>Submit</Button>
      </ReviewCrypto>
    );
  }
}

Rate.propTypes = {
  className: PropTypes.string,
  // ratingOnClick: PropTypes.func,
  onSubmit: PropTypes.func,
  // starNum: PropTypes.number,
  // onRef: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};

Rate.defaultProps = {
  title: 'Thank you!',
  description: 'Rate your trade with ICO shop',
};

export default Rate;
