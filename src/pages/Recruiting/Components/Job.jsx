import React from 'react';
import { FormattedMessage } from 'react-intl';
import ButtonApplyNow from './ButtonApplyNow'
import SocialButtons from './SocialButtons'


const CategoryItem = (props) => {
  // const { id, active, name, onClick } = props;
  const { id, name, seo_url, project, job_location, skill, summary, onClickApplyNow } = props;
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
          <ButtonApplyNow onClick={(e) => { e.preventDefault(); onClickApplyNow(id); }} />
          <div className="job-text-pr mt-2"><FormattedMessage id="landing_page.recruiting.label.getTheWordOut" /></div>
          <SocialButtons />
        </div>
      </div>
    </div>
  )
}

export default CategoryItem;
