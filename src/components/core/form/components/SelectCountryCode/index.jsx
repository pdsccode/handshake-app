import React from "react";
import COUNTRIES from "@/data/country-dial-codes.js";
import "./styles.scss";

class SelectCountryCode extends React.Component {
  state = {
    showSelect: false
  };

  toggleShowSelect = () => {
    this.setState({
      showSelect: !this.state.showSelect
    });
    if (!this.state.showSelect) {
      setTimeout(() => {
        this.selectListCountryCode.focus();
      }, 300);
    }
  };

  onItemClick = (dialCode) => {
    const { onChange } = this.props;
    onChange(dialCode);
    this.toggleShowSelect();
  };

  render() {
    const { countryCode, onChange } = this.props;
    const { showSelect } = this.state;
    return (
      <span>
        <span role="button" onClick={this.toggleShowSelect}>
          {countryCode}
        </span>
        {
          showSelect && (
            <div tabIndex="1" ref={(e) => { this.selectListCountryCode = e; }} className="select-list-country-code" onBlur={this.toggleShowSelect}>
              {
                COUNTRIES.map((item, index) => {
                  const { dialCode, name, flag } = item;
                  return (
                    <div className="select-item-country-code" key={index}
                         onClick={() => this.onItemClick(dialCode)}>{flag}{name} ({dialCode})</div>
                  );
                })
              }
            </div>
          )
        }
      </span>
    );
  }
}

export default SelectCountryCode;
