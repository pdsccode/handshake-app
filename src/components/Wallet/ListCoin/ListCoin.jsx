import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import {fieldDropdown, fieldInput} from '@/components/core/form/customField'
import { API_URL } from "@/constants";
import local from '@/services/localStore';
import {APP} from '@/constants';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import {getFiatCurrency} from '@/reducers/exchange/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import './ListCoin.scss';
import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';
import BrowserDetect from '@/services/browser-detect';

class ListCoin extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

    }
  }

render() {

  return (
    <div>
    </div>
    )
  }
}

ListCoin.propTypes = {
  wallet: PropTypes.any,
  currency: PropTypes.string,
};


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListCoin));
