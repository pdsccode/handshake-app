import React from 'react';
import cn from 'classnames';
import Error from '@/components/core/presentation/Error';

// components
import Label from '@/components/SeedAndBazaar/presentation/Label';

//self
import './InputField.scss';

class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {id, label, error, className, innerRef, ...props } = this.props;
    const classNames = cn('input-group', 'inputGroup', className);
    return (
      <div className={classNames}>

      </div>
    );
  }
}

export default DateTimePicker;
