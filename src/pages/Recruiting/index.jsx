import React from 'react';
import { connect } from 'react-redux';
import LandingWrapper from '@/components/LandingWrapper';
import axios from 'axios';
// import PropTypes from 'prop-types';
import './styles.scss';
import CategoryItem from './Components/CategoryItem';
import Job from './Components/Job';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';
import { URL } from '@/constants';
const idAllCategories = 0;

class Recruiting extends React.Component {
  state = {
    selectedCategoryId: idAllCategories,
    categories: [],
    jobs: [],
  };
  componentDidMount() {
    const { selectedCategoryId } = this.state;
    axios
      .get('https://www.autonomous.ai/api-v2/job-api/categories')
      .then(res => {
        this.setState({ categories: res.data.data });
      })
      .catch(err => console.log('err get categories', err));

    this.getJobs(selectedCategoryId);
  }
  getJobs = id => {
    let qs = '';
    if (id !== idAllCategories) {
      qs = `?category_id=${id}`;
    }
    axios
      .get(`https://www.autonomous.ai/api-v2/job-api/jobs${qs}`)
      .then(res => {
        this.setState({ jobs: res.data.data.items });
      })
      .catch(err => console.log('err get jobs', err));
  };
  handleClickCategoryItem = id => {
    this.setState({ selectedCategoryId: id });
    this.getJobs(id);
  };

  handleClickApplyNow = (id) => {
    console.log('id', id)
  }

  render() {
    const { categories, selectedCategoryId, jobs } = this.state;
    return (
      <LandingWrapper>
        <div className="row mt-5 recruiting">
          <div className="col-md-4">
            <CategoryItem
              id={idAllCategories}
              active={selectedCategoryId === idAllCategories}
              name="All"
              onClick={() => this.handleClickCategoryItem(idAllCategories)}
            />
            {categories.map(category => {
              const {
                id, name, seo_url, priority,
              } = category;
              return (
                <CategoryItem
                  key={id}
                  active={selectedCategoryId === id}
                  name={name}
                  onClick={() => this.handleClickCategoryItem(id)}
                />
              );
            })}
          </div>
          <div className="col-md-8">
            {
              jobs && jobs.length > 0 ?
                jobs.map(job => {
                  return (
                    <Link key={job.id} to={`${URL.RECRUITING}/${job.seo_url}`}>
                      <Job {...job} onClickApplyNow={this.handleClickApplyNow} />
                    </Link>
                  )
                }) : (
                  <div className="alert alert-danger" role="alert">
                    <FormattedMessage id="landing_page.recruiting.label.noJobs" />
                  </div>
                )
            }
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
