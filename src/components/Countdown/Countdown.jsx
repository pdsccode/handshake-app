import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class Countdown extends Component {
  static displayName = 'Countdown';
  static propTypes = {
    classNames: PropTypes.string,
    endTime: PropTypes.number.isRequired, // milliseconds
    renderer: PropTypes.func,
    showDays: PropTypes.bool,
    separator: PropTypes.string,
  };

  static defaultProps = {
    classNames: null,
    showDays: false,
    separator: ':',
  };

  constructor(props) {
    super(props);
    this.state = {
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props);
      if (date) {
        this.setState(date);
      } else {
        this.stop();
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.stop();
  }

  stop = () => {
    clearInterval(this.interval);
  }

  addLeadingZeros = (value, size = 2) => {
    let s = String(value);
    while (s.length < size) { s = `0${s}`; }
    return s;
  }

  calculateCountdown = ({ endTime, showDays }) => {
    const end = (endTime.toString().length === 10) ? endTime * 1000 : endTime;
    const seconds = parseInt((Math.max(0, end - Date.now()) / 1000).toFixed(0), 10);

    if (seconds <= 0) {
      this.stop();
    }

    const days = showDays ? this.addLeadingZeros(Math.floor(seconds / (3600 * 24))) : 0;

    return {
      days,
      hours: this.addLeadingZeros(Math.floor((seconds / 3600) % 24)),
      minutes: this.addLeadingZeros(Math.floor((seconds / 60) % 60)),
      seconds: this.addLeadingZeros(Math.floor(seconds % 60)),
      // milliseconds: Number(((seconds % 1) * 1000).toFixed()),
      completed: seconds === 0,
    };
  };

  renderDays = (days) => {
    return (<span className="CountdownItem Days">{days}</span>);
  }

  renderHours = (hours) => {
    return (<span className="CountdownItem Hours">{hours}</span>);
  }

  renderMinutes = (minutes) => {
    return (<span className="CountdownItem Minutes">{minutes}</span>);
  }

  renderSeconds = (seconds) => {
    return (<span className="CountdownItem Seconds">{seconds}</span>);
  }

  renderSeparator = (separator) => {
    return (
      <span className="CountdownSeparator">{separator}</span>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(Countdown.displayName, {
      [props.classNames]: !!props.classNames,
    });

    if (props.renderer) {
      return (
        <div className={cls}>
          {props.renderer({ ...props, ...state })}
        </div>
      );
    }

    return (
      <div className={cls}>
        {props.showDays && this.renderDays(state.days)}
        {this.renderHours(state.hours)}
        {state.minutes && this.renderSeparator(props.separator)}
        {this.renderMinutes(state.minutes)}
        {state.seconds && this.renderSeparator(props.separator)}
        {this.renderSeconds(state.seconds)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
