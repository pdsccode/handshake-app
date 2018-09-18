import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

class PexExtension extends React.PureComponent {
  static displayName = 'PexExtension';
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderComponent = (props, state) => {
    const cls = cx(PexExtension.displayName, {
      [props.className]: !!props.className,
    });
    return (
      <div className={cls}>
        {PexExtension.displayName}
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default PexExtension;
