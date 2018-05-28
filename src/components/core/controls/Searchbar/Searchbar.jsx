/**
 * SearchBar Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
// style
import './SearchBar.scss';
import SEARCH_ICON_SVG from '@/assets/images/icon/ic_search.svg';

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      value: '',
      suggestions: [],
      dirty: false,
    };
    this.handleInputSearchChange = this.handleInputSearchChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
  }
  // variable
  theme = user => ({
    container: 'search-bar-container',
    input: '',
    suggestionsList: `list-group`,
    suggestion: `list-group-item`,
    suggestionHighlighted: '',
    inputFocused: '',
    containerOpen: '',
    inputOpen: '',
  });

  set value(value) {
    this.setState({
      value,
    });
  }

  set suggestions(data) {
    this.setState({
      suggestions: data,
    });
  }

  set dirty(flag) {
    this.setState({
      dirty: flag,
    });
  }

  get allowShowResult() {
    return (
      this.state.suggestions.length > 0 &&
      this.state.dirty &&
      this.state.value !== ''
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.product_name;
  }

  renderSuggestion(suggestion) {
    return <span className={s.textBody}>{suggestion.product_name}</span>;
  }

  handleInputSearchChange(event, { newValue, method }) {
    this.value = newValue;
  }

  getSuggestions(value) {
    const suggestions = [];
    for (const i of this.state.products) {
      if (
        i.product_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        i.slug.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        JSON.stringify(i)
          .toLowerCase()
          .indexOf(value.toLowerCase()) > -1
      ) {
        suggestions.push(i);
        if (suggestions.length >= 5) {
          return suggestions;
        }
      }
    }
    return suggestions;
  }

  onSuggestionsFetchRequested({ value }) {
    this.suggestions = this.getSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.suggestions = [];
  }

  onSuggestionSelected(event, data) {
    if (typeof window !== 'undefined') {
      window.location = `/?slug=${data.suggestion.slug}&keyword=${
        data.suggestionValue
      }`;
      ga(
        'send',
        'event',
        'Header',
        'Search product in search bar',
        `${data.suggestionValue}: ${this.state.value}`,
      );
    }
  }

  onInputClick() {
  }

  componentWillMount() {
    try {
      const keyword = ''; // getValueParamURLQueryByName('keyword');
      if (keyword) {
        this.value = keyword;
      }
    } catch (e) {}
  }

  componentDidMount() {
  }

  renderInputComponent = inputProps => (
    <div className="input-container">
      <img className="icon-search" src={SEARCH_ICON_SVG} />
      <input
        className="search-input"
        onClick={this.onInputClick}
        {...inputProps}
      />
    </div>
  );
  
  render() {
    const { value, suggestions } = this.state;
    const { user } = this.props;

    const inputProps = {
      placeholder: 'Search',
      value,
      className: 'search-input',
      onChange: this.handleInputSearchChange,
    };

    const theme = {
      container: 'search-bar-container',
      input: ``,
      suggestionsList: `list-group`,
      suggestion: `list-group-item`,
      suggestionHighlighted: '',
      inputFocused: '',
      containerOpen: '',
      inputOpen: '',
    };
    return (
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        highlightFirstSuggestion
        focusInputOnSuggestionClick
        alwaysRenderSuggestions
      />
    );
  }
}

SearchBar.propTypes = {
  productList: PropTypes.array,
  user: PropTypes.object.isRequired,
};

SearchBar.defaultProps = {
  user: { status: 1 },
};

const mapState = state => ({
  user: state.user,
});

export default connect(mapState)(SearchBar);
