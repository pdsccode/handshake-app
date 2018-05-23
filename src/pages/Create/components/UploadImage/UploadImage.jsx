import React from 'react';
import PropTypes from 'prop-types';

// style
import './UploadImage.scss';

class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  deleteImage(index) {
    const newImages = this.state.images.filter(item => item.index !== index);
    this.setState({ images: newImages });
  }

  addImage() {
    const newImages = this.state.images.concat()
  }

  render() {
    return (
      <form>
        <input type="text" placeholder="ProjectName" />
        <input type="text" placeholder="crowdDate" />
        <input type="text" placeholder="crowdDate" />
      </form>
    );
  }
}

export default UploadImage;
