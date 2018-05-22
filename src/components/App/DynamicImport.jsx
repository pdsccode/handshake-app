import React from 'react';
import PropTypes from 'prop-types';

class DynamicImport extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    children: PropTypes.any,
    loading: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      component: this.props.loading,
    };
  }

  componentDidMount() {
    this.props.load()
      .then((component) => {
        this.setState(() => ({
          component: component.default ? component.default : component,
        }));
      });
  }
  render() {
    return this.props.children(this.state.component);
  }
}

export default DynamicImport;
