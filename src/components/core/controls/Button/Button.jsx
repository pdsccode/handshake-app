import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import loading from '@/assets/images/icon/loading.svg.raw';
// style
import './Button.scss';

class Button extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
    link: PropTypes.bool,
    to: PropTypes.string,
    block: PropTypes.bool,
    small: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isSubmit: PropTypes.bool,
    cssType: PropTypes.string,
    app: PropTypes.object,
    immunity: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    immunity: true,
    block: false,
    to: '',
    small: false,
    link: false,
    onClick: () => {},
    isLoading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      immunity: true,
    };

    this.loading = this.loading.bind(this);
    this.immunity = this.immunity.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.target === this.btnRef) {
      this.setState({ immunity: false });
    }
    this.props.onClick(e);
  }

  immunity() {
    if (this.props.immunity) {
      return true;
    }
    if (this.state.immunity) {
      return true;
    }
    return false;
  }

  loading() {
    if (this.props.isLoading) {
      return <span dangerouslySetInnerHTML={{ __html: loading }} />;
    }
    if (this.props.app.isCalling && !this.immunity()) {
      return <span dangerouslySetInnerHTML={{ __html: loading }} />;
    }
    return null;
  }

  typeClass(type) {
    switch (type) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
        return 'btn-success';
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-primary';
    }
  }

  render() {
    const {
      type,
      cssType,
      link,
      block,
      small,
      className,
      children,
      to,
      disabled,
      isLoading,
      style,
    } = this.props;
    const typeClass = this.typeClass(cssType);
    const Tag = link ? Link : 'button';

    return (
      <Tag
        to={to || ''}
        className={cn(
          'btn',
          'button',
          typeClass,
          className,
          `${block ? 'btn-block' : ''}`,
          `${small ? 'small' : ''}`,
          `${disabled ? 'disabled' : ''}`,
          `${
            isLoading || (this.props.app.isCalling && !this.immunity())
              ? 'disabled'
              : ''
          }`,
        )}
        style={style}
        type={type || ''}
        onClick={this.onClick}
        disabled={
          isLoading ||
          (this.props.app.isCalling && !this.immunity()) ||
          disabled
        }
        ref={(div) => {
          this.btnRef = div;
          return null;
        }}
      >
        {this.loading()}
        {children}
      </Tag>
    );
  }
}

export default connect(state => ({ app: state.app }))(Button);
