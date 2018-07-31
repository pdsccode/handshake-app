import { FormattedMessage, injectIntl } from 'react-intl';
import React from 'react';
import Dropzone from 'react-dropzone';
// import PreviewImage from './PreviewImage';

// import placeHolder from '@/assets/images/icon/upload-image.svg';

import $http from '@/services/api';
// import { BASE_API } from '@/constants';
import { connect } from 'react-redux';

// const line = require('static/images/line.svg')

export class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    file: null,
    isUploadSuccessful: false,
  }

  handleClickSubmit = () => {
    const { file } = this.state;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    $http({
      method: 'POST',
      url: 'https://www.autonomous.ai/api-v2/job-api/job-cv',
      data: formData,
      // onUploadProgress: (progressEvent) => {
      //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   const correspondingFile = newFiles.find(item => item.name === file.name);
      //   if (correspondingFile) {
      //     correspondingFile.percent = percentCompleted;
      //   }
      //   this.setState({ files: newFiles });
      //   this.forceUpdate();
      // },
    }).then((res) => {
      this.setState({ isUploadSuccessful: true })
      // const correspondingFile = newFiles.find(item => item.name === file.name);
      // if (correspondingFile) {
      //   correspondingFile.url = `https://cdn-handshake-staging.autonomous.ai/${res.data.data}`;
      //   delete correspondingFile.percent;
      //   this.setState({ files: newFiles });
      //   this.forceUpdate();
      //   onSuccess(newFiles);
      // }
    }).catch((err) => {
      console.log('err upload image', err);
    });
  }

  onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    this.setState({ file });
  }

  onOpenClick = () => {
    this.dropzone.open();
  }
  render() {
    const { file, isUploadSuccessful } = this.state;
    return (
      <div>
        {
          !isUploadSuccessful ? (
            <div>
              <Dropzone
                disablePreview
                multiple={false}
                accept="image/*, .pdf, .doc, .docx"
                style={{
                  background: '#F9F9F9',
                  border: '2px dashed #CBCBCB',
                  height: '56px',
                  width: '100%',
                  borderRadius: '6px',
                }}
                ref={e => (this.dropzone = e)}
                onDrop={this.onDrop}
                // disableClick
              >
                <div className="text-center mt-3">
                  {
                    file ? <div>{file.name}</div>
                      : <FormattedMessage id="landing_page.recruiting.applyNow.label.uploadDocs" />
                  }
                </div>
              </Dropzone>
              <div className="mt-1"><FormattedMessage id="landing_page.recruiting.applyNow.label.weAccept" /></div>
              <div className="mt-2"><button className="btn btn-primary btn-block" onClick={this.handleClickSubmit}><FormattedMessage id="landing_page.recruiting.applyNow.label.submit" /></button></div>
              <hr />
              <div className="mt-2"><a href="https://www.linkedin.com/in/duyhtq/" target="__blank" className="btn btn-primary btn-block"><FormattedMessage id="landing_page.recruiting.applyNow.label.connectToLinkedIn" /></a></div>
            </div>
          ) : (
            <div className="text-center">
              <div>
                <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/success.svg" />
              </div>
              <div>
                <h5><strong><FormattedMessage id="landing_page.recruiting.applyNow.label.thankYou" /></strong></h5>
              </div>
              <div className="text-muted">
                <FormattedMessage id="landing_page.recruiting.applyNow.label.weReview" />
              </div>
            </div>
          )
        }

      </div>
    );
  }
}

Component.propTypes = {
};

const mapState = state => ({
  authProfile: state.auth.profile,
});

const mapDispatch = ({
});

export default injectIntl(connect(mapState, mapDispatch)(Component));
