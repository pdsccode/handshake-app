import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCommentCountById } from '@/reducers/comment/action';
import { API_URL } from '@/constants';
import Helper from '@/services/helper';

import './TopInfo.scss';

class TopInfo extends React.Component {
  static propTypes = {
    marketTotal: PropTypes.number,
    percentFee: PropTypes.number,
    getCommentCountById: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      commentNo: 0,
    };
  }

  componentDidMount() {
    this.getCommentCount(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.objectId !== this.props.objectId) {
      this.getCommentCount(nextProps);
    }
  }

  getCommentCount(props) {
    const { objectId, getCommentCountById } = props;
    if (objectId) {
      getCommentCountById({
        PATH_URL: API_URL.COMMENT.GET_COMMENT_COUNT,
        qs: { object_id: Helper.getObjectIdOfComment({ id: objectId }) },
        successFn: ({ status, data }) => {
          this.setState({ commentNo: data });
        },
        errorFn: () => this.setState({ commentNo: 0 }),
      });
    }
  }

  render()  {
    const { marketTotal, percentFee } = this.props;
    const { commentNo } = this.state;
    return (
      <div className="wrapperTopInfoContainer">
        <div className="boxInfo">
          <div className="number">{marketTotal} ETH</div>
          <div className="des">Traded volume</div>
        </div>
        <div className="boxInfo">
          <div className="number">{percentFee}%</div>
          <div className="des">Wining fee</div>
        </div>
        <div className="boxInfo">
          <div className="number">{commentNo}</div>
          <div className="des">comments</div>
        </div>
      </div>
    );
  }
}

const mapDispatch = ({
  getCommentCountById,
});

export default connect(null, mapDispatch)(TopInfo);
