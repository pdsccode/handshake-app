import React from 'react';
import { FormattedMessage } from 'react-intl';

const CategoryItem = (props) => {
  // const { id, active, name, onClick } = props;
  const { id, name, seo_url, project, job_location, skill, summary } = props;
  console.log('skill ', skill)
  const normalizedSkills = skill.split(', ')
  return (
    <div key={id} className={`recruiting-job`}>
      <div className="row align-items-center">
        <div className="col-12 col-lg-8">
          <div className="job-name">{name}</div>
          <div className="job-project">{project}</div>
          <div className="job-location">{job_location.name}</div>
          <div className="job-summary">{summary}</div>
          <div className="mt-2">
            {
              normalizedSkills.map((skillItem, index) => {
                return <span key={index} className="job-skill">{skillItem}</span>
              })
            }
          </div>
        </div>
        <div className="col-12 col-lg-4 text-center">
          <button className="btn btn-primary btn-lg">Apply now</button>
          <div className="job-text-pr mt-2"><FormattedMessage id="landing_page.recruiting.label.getTheWordOut" /></div>
          <div className="job-social mt-2">
            <a><img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg" /></a>
            <a><img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg" /></a>
            <a><img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/linkedin.svg" /></a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryItem;
