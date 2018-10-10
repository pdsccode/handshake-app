import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadIDVerificationDocuments, updateIDVerificationDocument } from '@/reducers/admin/action';
import Image from '@/components/core/presentation/Image';
import { API_URL } from '@/constants';
import Login from '@/components/handshakes/betting-event/Login';
import moment from 'moment';

import './Admin.scss';

const IMAGE_BASE_URL = process.env.CDN_URL;
const DOCUMENT_TYPES = [
  'Passport',
  'Driver License',
  'Goverment ID Card',
];

class AdminIDVerification extends React.Component {
  static propTypes = {
    loadIDVerificationDocuments: PropTypes.func.isRequired,
    updateIDVerificationDocument: PropTypes.func.isRequired,
    login: PropTypes.bool,
  }

  static defaultProps = {
    login: false,
  }

  constructor(props) {
    super(props);
    this.token = this.getAdminHash() || '';
    this.state = {
      documents: [],
      login: this.token.length > 0,
    };
    this.documentRef = {};
  }

  componentDidMount() {
    if (this.state.login) {
      this.fetchDocuments();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { login } = nextProps;
    const newLogin = login === true ? login : this.state.login;
    this.setState({
      login: newLogin,
    }, () => {
      setTimeout(() => {
        this.fetchDocuments();
      }, 500);
    });
  }

  getAdminHash() {
    return sessionStorage.getItem('admin_hash');
  }

  fetchDocuments() {
    if (!this.state.login) {
      return;
    }
    this.token = this.token || this.getAdminHash() || '';
    this.props.loadIDVerificationDocuments({
      PATH_URL: `${API_URL.ID_VERIFICATION.GET_DOCUMENTS}`,
      headers: { AdminHash: this.token },
      successFn: (response) => {
        if (response.status === 1) {
          this.setState({ documents: response.data });
        }
      },
    });
  }

  approve(itemId) {
    this.updateStatus(itemId, 1);
  }

  reject(itemId) {
    this.updateStatus(itemId, -1);
  }

  updateStatus(itemId, status) {
    const data = new FormData();
    data.append('id', itemId);
    data.append('status', status);
    this.props.updateIDVerificationDocument({
      PATH_URL: `${API_URL.ID_VERIFICATION.UPDATE_STATUS}`,
      METHOD: 'POST',
      headers: { AdminHash: this.token },
      data,
      successFn: (response) => {
        if (response.status === 1) {
          this.documentRef[itemId].style.display = 'none';
        }
      },
    });
  }

  render() {
    const { documents, login } = this.state;
    return !login ?
      (<Login />) : (
        <div className="admin-id-verification">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Document Number</th>
                <th>Document Type</th>
                <th>Front Image</th>
                <th>Back Image</th>
                <th>Selfie Image</th>
                <th>Upload Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((item, i) => {
                const frontImage = `${IMAGE_BASE_URL}/${item.front_image}`;
                const backImage = `${IMAGE_BASE_URL}/${item.back_image}`;
                const selfieImage = `${IMAGE_BASE_URL}/${item.selfie_image}`;
                const uploadDate = moment(item.date_modified).format('MM/DD/YYYY');

                return (
                  <tr key={`id_verification_item_${item.id}`} ref={(node) => { this.documentRef[item.id] = node; }}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.id_number}</td>
                    <td>{DOCUMENT_TYPES[item.id_type]}</td>
                    <td><a href={frontImage} target="_blank" rel="noopener noreferrer">{item.front_image ? (<Image src={frontImage} />) : ''}</a></td>
                    <td><a href={backImage} target="_blank" rel="noopener noreferrer">{item.back_image ? (<Image src={backImage} />) : ''}</a></td>
                    <td><a href={selfieImage} target="_blank" rel="noopener noreferrer">{item.selfie_image ? (<Image src={selfieImage} />) : ''}</a></td>
                    <td>{uploadDate}</td>
                    <td><a href="#" onClick={() => this.approve(item.id)}>Approve</a> / <a href="#" onClick={() => this.reject(item.id)}>Reject</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
  }
}

const mapState = state => ({
  login: state.admin.login,
});

const mapDispatch = ({
  loadIDVerificationDocuments,
  updateIDVerificationDocument,
});

export default connect(mapState, mapDispatch)(AdminIDVerification);
