import React from 'react';
import cn from 'classnames';
import Error from '@/components/core/presentation/Error';

// components
import Label from '@/components/SeedAndBazaar/presentation/Label';

//self
import './InputField.scss';

class InputField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {id, label, error, className, innerRef, ...props } = this.props;
    const classNames = cn('input-group', 'inputGroup', className);
    return (
      <div className={classNames}>
        <Label htmlFor={id} className="label">{label}</Label>
        <input ref={innerRef} id={id} {...props} />
        <div>
          <Error message={error} isShow={!!error} />
        </div>
      </div>
    );
  }
}

export default InputField;
