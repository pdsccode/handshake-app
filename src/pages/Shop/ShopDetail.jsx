import React from 'react';
//
import Button from '@/components/core/controls/Button/Button';
import Modal from '@/components/core/controls/Modal';
//
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import { Field, clearFields, change } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import $http from '@/services/api';
import SimpleSlider from '@/components/core/controls/Slider';
import Tabs from '@/components/handshakes/betting/Feed/Tabs';
import { hideHeader } from '@/reducers/app/action';
// style
import './ShopDetail.scss';
const EthSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/eth-sign.svg';
const BuyNowForm = createForm({ propsReduxForm: { form: 'BuyNowForm', enableReinitialize: true, clearSubmitErrors: true}});
const SELLER_CONFIG = {
  ETH_ADDRESS: '0xA8a6d153C3c3F5098eEc885E6c39437dE5cA74Fd',
  URL_CONFIRM: 'http://localhost:8080/shop/confirm',
};
const ETH_GATEWAY_ID = 9;

class ShopDetail extends React.Component {

  static propTypes = {
    hideHeader: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      tabActive: 0,
      product: {},
      productInfo: {
        image_info: [],
      },
      productInfoHtml: [],
      productReviews: [],
      productSpecs: [],
      productFAQ: [],
    };
    // need hide header
    props.hideHeader();
    // bind
    this.placeOrder = ::this.placeOrder;
  }
  
  componentDidMount() {
    // call ajax
    const url = 'https://www.autonomous.ai/api-v2/product-api/product-info/1221';
    const data = {
      option1: 1,
      option2: 6,
      option16: 37,
      option17: 41,
    };
    const productInfo = $http({ url, data, method: 'POST' });
    productInfo.then(result =>  {
      const { data:source } = result;
      this.setState({ productInfo: source.product_info});
    });

    // get product
    const url2 = 'https://www.autonomous.ai/api-v2/product-api/product/1221?option1=1&option16=37&option17=41&option2=6';
    const product = $http({ url: url2, method: 'GET' });
    product.then(result =>  {
      const { data:source } = result;
      this.setState({ product: source.product});
    });
    // get product info
    const urlProductInfo = 'https://www.autonomous.ai/api-v2/product-api/product-spec/1221?type=1';
    const productInfoIntro = $http({ url: urlProductInfo, method: 'GET' });
    productInfoIntro.then(result =>  {
      const { data:source } = result;
      this.setState({ productInfoHtml: source.data });
    });
    // get specs
    const urlProductSpecs = 'https://www.autonomous.ai/api-v2/product-api/product-spec/1221?type=2';
    const productSpecs = $http({ url: urlProductSpecs, method: 'GET' });
    productSpecs.then(result =>  {
      const { data:source } = result;
      this.setState({ productSpecs: source.data });
    });
    // get faq
    const urlProductFAQ = 'https://www.autonomous.ai/api-v2/product-api/product-questions/1221';
    const productFAQ = $http({ url: urlProductFAQ, method: 'GET' });
    productFAQ.then(result =>  {
      const { data:source } = result;
      this.setState({ productFAQ: source.product_questions });
    });
    // get reviews
    const urlProductReviews = 'https://www.autonomous.ai/api-v2/product-api/product-reviews/1221?page=1&page_size=10';
    const productReviews = $http({ url: urlProductReviews, method: 'GET' });
    productReviews.then(result =>  {
      const { data:source } = result;
      this.setState({ productReviews : source.data });
    });

  }

  videoOrImage(firstGallery, productName) {
    if (firstGallery.is_video) {
      // video
      return <iframe src={firstGallery.youtube_url} />
    } else {
      // image
      return <img src={firstGallery.image} alt={productName} />
    }
  }

  placeOrder() {
    // call place order
    const url = 'https://dev.autonomous.ai/api-v2/order-api/order/cart/checkout?use_wallet=false&promo=0    ';
    const data = {
      customer: {
        billing_address: '',
        city: 'New York',
        country: 'US',
        email: 'tam@autonomous.ai',
        fullname: 'tam nguyen',
        phone: '',
        shipping_address: 'a75/6k/14',
        state: 'NY',
        zip: '10001',
      },
      payment: {
        cc: null,
        credit: 0,
        gateway_id: ETH_GATEWAY_ID,
      },
      product: {
        options: {
          option1:1,
          option2:4,
          option16:37,
          option17:41,
        },
        product_id:1221,
        quantity:1,
      },
    };
    const placeOrder = $http({ url, data, method: 'POST' });
    placeOrder.then(result => {
      const { data:source } = result;
      const { order_id } = source.order;
      // redirect to payment
      const paymentUrl = `http://localhost:8080/payment?order_id=${order_id}&amount=${99}&fiat_currency=USD&to=ETH%${SELLER_CONFIG.ETH_ADDRESS}&confirm_url=${SELLER_CONFIG.URL_CONFIRM}`;
      window.location.href = paymentUrl;
    });
  }

  render() {
    const { product, productInfo, productInfoHtml, productSpecs, productFAQ } = this.state;
    const imageSetting = {
      customPaging: i => <span className="dot" />,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      lazyLoad: 'progressive',
      className: 'carousel',
    };

    return (
      <div className="ShopDetail">
        <div className="header-info">
          <div className="vendor">
            <img src={product.vendor_thumb} alt={product.vendor_name} />
            <span>{product.vendor_name}</span>
          </div>
          <p className="product-name">{product.name}</p>
        </div>
        <SimpleSlider settings={imageSetting}>
          {
            productInfo.image_info.map(img =>
              <img src={img.image_url} alt={img.image_alt} />
            )
          }
        </SimpleSlider>
        <p className="price">
          <img src={EthSVG} alt="Eth" />&nbsp;
          {productInfo.eth_price}
          <span className="shipping-date">
            <img src="https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/shipping-icon.svg" alt="shipping" />
            {productInfo.shipping_date}
          </span>
        </p>
        <div className="buy-now-btn">
          <Button block onClick={() => this.modalBuyNowRef.open()}>
            Buy now
          </Button>
        </div>
        <div className="warranty-block">
          <div>
            <strong>30-DAY TRIAL.</strong>
          </div>
          <div>
            <strong>5-YEAR WARRANTY.</strong>
          </div>
        </div>
        <Tabs htmlClassName="information-tab">
          <div label="Product info">
            {
              productInfoHtml.map(item => <p dangerouslySetInnerHTML={{ __html: item }} />)
            }
          </div>
          <div label="Specs">
            {
              productSpecs.map(item => <p dangerouslySetInnerHTML={{ __html: item }} />)
            }
          </div>
          <div label="FAQ">
            {
              productFAQ.map(item => <p dangerouslySetInnerHTML={{ __html: item.question }} />)
            }
          </div>
          <div label={`Reviews (${product.review_count})`}>
            <p>test</p>
          </div>
        </Tabs>
        {/* modal buy now */}
        <Modal title="Your Information" onRef={modal => this.modalBuyNowRef = modal}>
          <BuyNowForm onSubmit={this.placeOrder}>
            <div>
              <label htmlFor="">Quantity</label>
              <Field key="0" name="quantity" type="number" className="form-control" component={fieldInput}
                autoComplete="off" value={1000} />
            </div>
            <div>
              <label htmlFor="">Name</label>
              <Field key="1" name="name" placeholder="Your name" type="text" className="form-control" component={fieldInput}
                autoComplete="off" />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <Field key="2" name="email" placeholder={"Email for order confirmation"} type="text" className="form-control"
                component={fieldInput}  autoComplete="off" />
            </div>
            <div>
              <label htmlFor="">Address</label>
              <Field key="3" name="address" placeholder="Shipping address" type="text" className="form-control" component={fieldInput}
                autoComplete="off" />
            </div>
            <div>
              <Field key="4" name="zip" placeholder="Zip code" type="text" className="form-control" component={fieldInput} 
                autoComplete="off" />
              <Field key="5" name="city" placeholder="City" type="text" className="form-control" component={fieldInput} 
                autoComplete="off" />
              <Field key="6" name="state" placeholder="State" type="text" className="form-control" component={fieldInput} 
                autoComplete="off" />
                <Field key="7" name="country" placeholder="Country" type="text" className="form-control" component={fieldInput} 
                autoComplete="off" />
            </div>
            <div>
              <label htmlFor="">Phone</label>
              <Field key="8" name="phone" placeholder="Phone for delivery" type="text" className="form-control" component={fieldInput}
                autoComplete="off" />
            </div>
            <Button block >
              Submit
            </Button>
            <div className="order-information">
              <div className="field-info">
                <div></div>
                <div></div>
              </div>
            </div>
          </BuyNowForm>
        </Modal>
        {/* end modal buy now */}
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, ({ hideHeader }))(withRouter(ShopDetail)));