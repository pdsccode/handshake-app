import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { createComment } from '@/reducers/comment/action';
import { API_URL, HANDSHAKE_ID } from '@/constants';

// components
import Image from '@/components/core/presentation/Image';

// style, icons
import './CreateComment.scss';
import createImageIcon from '@/assets/images/icon/comment/image.svg';
import postCommentIcon from '@/assets/images/icon/comment/post-comment.svg';
import deleteIcon from '@/assets/images/icon/comment/delete-icon.svg';

class CreateComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
    };
    this.createComment = ::this.createComment;
    this.handleImageChange = ::this.handleImageChange;
    this.deleteImage = ::this.deleteImage;
    this.resetState = ::this.resetState;
    this.autoResizeTextArea = ::this.autoResizeTextArea;
  }
  isInFirstRow = true;

  resetState() {
    this.setState({
      file: '',
      imagePreviewUrl: '',
    });
  }

  createComment() {
    const { file } = this.state;
    const { objectId, objectType } = this.props;
    const rawData = { comment: this.textareaRef.value, object_type: objectType.toString(), object_id: objectId };
    const data = new FormData();
    data.append('request', JSON.stringify(rawData));
    if(!!file) {
      data.append('image', this.uploadImageRef.files[0]);
    }
    this.props.createComment({
      PATH_URL: API_URL.COMMENT.CREATE,
      METHOD: 'post',
      data,
      successFn: () => {
        this.props.onCreateCb();
        this.resetState();
        this.textareaRef.value = '';
        this.textareaRef.style.height = '40px';
      }
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    if(e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      const file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  deleteImage(e) {
    e && e.preventDefault();
    this.resetState();
  }

  autoResizeTextArea() {
    if (this.textareaRef) {
      setTimeout(() => {
        const offsetHeightIsLessThanScrollHeight = (this.textareaRef.offsetHeight + 10) < this.textareaRef.scrollHeight;
        const isClearTextToFirstRow = this.textareaRef.value.length < 30;
        if(!this.isInFirstRow || offsetHeightIsLessThanScrollHeight) {
          if(this.isInFirstRow) this.isInFirstRow = false;
          if(!this.isInFirstRow && isClearTextToFirstRow) {
            this.isInFirstRow = true;
            this.textareaRef.style.height = '40px';
          } else {
            this.textareaRef.style.height = 'auto';
            this.textareaRef.style.height = `${this.textareaRef.scrollHeight}px`;
          }
        }
      }, 0);
    }
  }

  render() {
    const { imagePreviewUrl } = this.state;
    const { addComment } = this.props;
    return (
      <div className="createComment">
        {
          imagePreviewUrl && (
            <div className="preview">
              <img src={deleteIcon} alt="delete icon" onClick={this.deleteImage} />
              <img src={imagePreviewUrl} className="img-responsive" alt="preview image" />
            </div>
          )
        }
        <div className="imageUpload">
          <label className="sr-only" htmlFor="image-upload">Image Upload</label>
          <input onChange={this.handleImageChange} type="file" accept="image/*" id="image-upload" ref={element => {this.uploadImageRef = element;}} />
          <Image src={createImageIcon} alt="create image icon" />
        </div>
        <textarea
          type="text"
          placeholder="Aa"
          ref={(component) => { this.textareaRef = component; }}
          autoFocus={addComment === 'true'}
          onKeyDown={this.autoResizeTextArea}
        />
        <Image src={postCommentIcon} alt="post comment icon" onClick={this.createComment} />
      </div>
    );
  }
}

CreateComment.propTypes = {
  createComment: PropTypes.func.isRequired,
  objectType: PropTypes.string,
  objectId: PropTypes.string,
};

CreateComment.defaultProps = {
  objectType: HANDSHAKE_ID.BETTING.toString(),
  objectId: '1',
};

const mapDispatch = ({
  createComment,
});

export default connect(null, mapDispatch)(CreateComment);
