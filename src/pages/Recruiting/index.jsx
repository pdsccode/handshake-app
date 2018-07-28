import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import LandingWrapper from '@/components/LandingWrapper';
import axios from 'axios';

// import PropTypes from 'prop-types';
import './styles.scss';
import CategoryItem from './Components/CategoryItem';

const idAllCategories = 0;
class Recruiting extends React.Component {
  state = {
    selectedCategory: idAllCategories,
    categories: []
  }
  componentDidMount() {
    axios.get('https://www.autonomous.ai/api-v2/job-api/categories')
      .then(res => {
        this.setState({ categories: res.data.data })
      })
      .catch(err => console.log('err get categories', err))
  }
  handleClickCategoryItem = (id) => {
    this.setState({ selectedCategory: id })
  }
  render() {
    const { categories, selectedCategory } = this.state;
    return (
      <LandingWrapper>
        <div className="row mt-5 recruiting">
          <div className="col-md-4">
            <CategoryItem id={idAllCategories} active={selectedCategory===idAllCategories} name={'All'} onClick={() => this.handleClickCategoryItem(idAllCategories)} />
            {
              categories.map((category) => {
                const { id, name, seo_url, priority } = category;
                return (
                  <CategoryItem id={id} active={selectedCategory === id} name={name} onClick={() => this.handleClickCategoryItem(id)} />
                )
              })
            }
          </div>
          <div className="col-md-8">
            Jobs
          </div>
        </div>
      </LandingWrapper>
    );
  }
}

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Recruiting));
