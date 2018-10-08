import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import './ConfirmButton.scss';

class ConfirmButton extends Component {

  constructor(props) {
    super(props);
    this.timer = null;

    this.state = {
      volume: 0,
      confirm: false,
      delay: props.delay || 100,
      buttonText: props.buttonText || "Slide to Confirm",
      buttonConfirmedText: props.buttonConfirmedText || "Confirmed"
      // icon: props.icon
    };
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
  }

  onChangeComplete = () => {
    if (this.state.volume < 100){
      this.setState({
        volume: 0, confirm: false
      })
    }
    else{
      const {onConfirmed} = this.props;

      if (!this.state.confirm){
        this.setState({
          confirm: true
        }, ()=>{
          clearTimeout(this.timer);
            this.timer = setTimeout(function() {
              // once
              onConfirmed();
          }, 100);
        })
      }
    }
  }


  render (){
    let { volume } = this.state
    let text = this.state.confirm ? this.state.buttonConfirmedText : this.state.buttonText;

    return (
      <div>
        <div className="confirm-button">
          <label>{text}</label>
          <Slider
            value={volume}
            tooltip={false}
            onChangeComplete={this.onChangeComplete}
            onChange={this.handleOnChange}
          />
        </div>
      </div>
    );
  }

}

export default ConfirmButton;
