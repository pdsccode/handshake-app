import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle } from '@/reducers/app/action';
import COUNTRIES from '@/data/country-dial-codes.js';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import { Field } from 'redux-form';
import { fieldCleave } from '@/components/core/form/customField';
import ModalDialog from '@/components/core/controls/ModalDialog';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import CheckedSVG from '@/assets/images/icon/checked.svg';
import './Profile.scss';

const NumberPhoneForm = createForm({
  propsReduxForm: {
    form: 'NumberPhoneForm',
  },
});
const EmailForm = createForm({
  propsReduxForm: {
    form: 'EmailForm',
  },
});

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countryCode: COUNTRIES[0], // default is US
      phoneCollapse: false,
      emailCollapse: false,
    };
    // bind
    this.verifyPhone = ::this.verifyPhone;
    this.verifyEmail = ::this.verifyEmail;
    this.selectPhoneRegionCode = ::this.selectPhoneRegionCode;

    props.setHeaderTitle('My Profile');
  }

  verifyPhone() {
    this.modalVerifyRef.open();
  }

  verifyEmail() {
    this.modalVerifyRef.open();
  }

  selectPhoneRegionCode(country) {
    this.setState({
      countryCode: country,
    });
  }

  render() {
    const { countryCode } = this.state;
    return (
      <Grid className="profile">
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({phoneCollapse: !state.phoneCollapse}))}>
                <p className="label">Phone Number</p>
                <div className="extend">
                  <Image className={this.state.phoneCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow"/>
                </div>
              </div>
              <div className={`content ${this.state.phoneCollapse ? '' : 'd-none'}`}>
                <p className="text">In order to protect the security of your account, please add your phone number.</p>
                <p className="text">Enter phone number</p>
                <NumberPhoneForm onSubmit={this.verifyPhone}>
                  <div className="phone-block">
                    <select className="country-code">
                      <option value="44">🇬🇧 +44</option>
                      <option value="1" defaultValue>🇺🇸 +1</option>
                      <optgroup label="Other countries">
                        <option value="213">🇩🇿 +213</option>
                        <option value="376">🇦🇩 +376</option>
                        <option value="244">🇦🇴 +244</option>
                        <option value="1264">🇦🇮 +1264</option>
                        <option value="1268">🇦🇬 +1268</option>
                        <option value="54">🇦🇷 +54</option>
                        <option value="374">🇦🇲 +374</option>
                        <option value="297">🇦🇼 +297</option>
                        <option value="61">🇦🇺 +61</option>
                        <option value="43">🇦🇹 +43</option>
                        <option value="994">🇦🇿 +994</option>
                        <option value="1242">🇧🇸 +1242</option>
                        <option value="973">🇧🇭 +973</option>
                        <option value="880">🇧🇩 +880</option>
                        <option value="1246">🇧🇧 +1246</option>
                        <option value="375">🇧🇾 +375</option>
                        <option value="32">🇧🇪 +32</option>
                        <option value="501">🇧🇿 +501</option>
                        <option value="229">🇧🇯 +229</option>
                        <option value="1441">🇧🇲 +1441</option>
                        <option value="975">🇧🇹 +975</option>
                        <option value="591">🇧🇴 +591</option>
                        <option value="387">🇧🇦 Herzegovina +387</option>
                        <option value="267">🇧🇼 +267</option>
                        <option value="55">🇧🇷 +55</option>
                        <option value="673">🇧🇳 +673</option>
                        <option value="359">🇧🇬 +359</option>
                        <option value="226">🇧🇫 +226</option>
                        <option value="257">🇧🇮 +257</option>
                        <option value="855">🇰🇭 +855</option>
                        <option value="237">🇨🇲 +237</option>
                        <option value="1">🇨🇦 +1</option>
                        <option value="238">🇨🇻 +238</option>
                        <option value="1345">🇰🇾 +1345</option>
                        <option value="236">🇨🇫 +236</option>
                        <option value="56">🇨🇱 +56</option>
                        <option value="86">🇨🇳 +86</option>
                        <option value="57">🇨🇴 +57</option>
                        <option value="269">🇰🇲 +269</option>
                        <option value="242">🇨🇬 +242</option>
                        <option value="682">🇨🇰 Islands +682</option>
                        <option value="506">🇨🇷 Rica +506</option>
                        <option value="385">🇭🇷 +385</option>
                        <option value="53">🇨🇺 +53</option>
                        <option value="90392">🇨🇾 +90392</option>
                        <option value="357">🇨🇾 +357</option>
                        <option value="42">🇨🇿 +42</option>
                        <option value="45">🇩🇰 +45</option>
                        <option value="253">🇩🇯 +253</option>
                        <option value="1809">🇩🇲 +1809</option>
                        <option value="1809">🇩🇴 +1809</option>
                        <option value="593">🇪🇨 +593</option>
                        <option value="20">🇪🇬 +20</option>
                        <option value="503">🇸🇻 +503</option>
                        <option value="240">🇬🇶 +240</option>
                        <option value="291">🇪🇷 +291</option>
                        <option value="372">🇪🇪 Estonia +372</option>
                        <option value="251">🇪🇹 Ethiopia +251</option>
                        <option value="500">🇫🇰 Falkland Islands +500</option>
                        <option value="298">🇫🇴 Faroe Islands +298</option>
                        <option value="679">🇫🇯 Fiji +679</option>
                        <option value="358">🇫🇮 Finland +358</option>
                        <option value="33">🇫🇷 France +33</option>
                        <option value="594">🇬🇫 French Guiana +594</option>
                        <option value="689">🇵🇫 French Polynesia +689</option>
                        <option value="241">🇬🇦 Gabon +241</option>
                        <option value="220">🇬🇲 Gambia +220</option>
                        <option value="7880">🇬🇪 Georgia +7880</option>
                        <option value="49">🇩🇪 Germany +49</option>
                        <option value="233">🇬🇭 Ghana +233</option>
                        <option value="350">🇬🇮 Gibraltar +350</option>
                        <option value="30">🇬🇷 Greece +30</option>
                        <option value="299">🇬🇱 Greenland +299</option>
                        <option value="1473">🇬🇩 Grenada +1473</option>
                        <option value="590">🇬🇵 Guadeloupe +590</option>
                        <option value="671">🇬🇺 Guam +671</option>
                        <option value="502">🇬🇹 Guatemala +502</option>
                        <option value="224">🇬🇳 Guinea +224</option>
                        <option value="245">🇬🇼 Guinea - Bissau +245</option>
                        <option value="592">🇬🇾 Guyana +592</option>
                        <option value="509">🇭🇹 Haiti +509</option>
                        <option value="504">🇭🇳 Honduras +504</option>
                        <option value="852">🇭🇰 Hong Kong +852</option>
                        <option value="36">🇭🇺 Hungary +36</option>
                        <option value="354">🇮🇸 Iceland +354</option>
                        <option value="91">🇮🇳 India +91</option>
                        <option value="62">🇮🇩 Indonesia +62</option>
                        <option value="98">🇮🇷 Iran +98</option>
                        <option value="964">🇮🇶 Iraq +964</option>
                        <option value="353">🇮🇪 Ireland +353</option>
                        <option value="972">🇮🇱 Israel +972</option>
                        <option value="39">🇮🇹 Italy +39</option>
                        <option value="1876">🇯🇲 Jamaica +1876</option>
                        <option value="81">🇯🇵 Japan +81</option>
                        <option value="962">🇯🇴 Jordan +962</option>
                        <option value="7">🇰🇿 Kazakhstan +7</option>
                        <option value="254">🇰🇪 Kenya +254</option>
                        <option value="686">🇰🇮 Kiribati +686</option>
                        <option value="850">🇰🇵 Korea North +850</option>
                        <option value="82">🇰🇷 Korea South +82</option>
                        <option value="965">🇰🇼 Kuwait +965</option>
                        <option value="996">🇰🇬 Kyrgyzstan +996</option>
                        <option value="856">🇱🇦 Laos +856</option>
                        <option value="371">🇱🇻 Latvia +371</option>
                        <option value="961">🇱🇧 Lebanon +961</option>
                        <option value="266">🇱🇸 Lesotho +266</option>
                        <option value="231">🇱🇷 Liberia +231</option>
                        <option value="218">🇱🇾 Libya +218</option>
                        <option value="417">🇱🇮 Liechtenstein +417</option>
                        <option value="370">🇱🇹 Lithuania +370</option>
                        <option value="352">🇱🇺 Luxembourg +352</option>
                        <option value="853">🇲🇴 Macao +853</option>
                        <option value="389">🇲🇰 Macedonia +389</option>
                        <option value="261">🇲🇬 Madagascar +261</option>
                        <option value="265">🇲🇼 Malawi +265</option>
                        <option value="60">🇲🇾 Malaysia +60</option>
                        <option value="960">🇲🇻 Maldives +960</option>
                        <option value="223">🇲🇱 Mali +223</option>
                        <option value="356">🇲🇹 Malta +356</option>
                        <option value="692">🇲🇭 Marshall Islands +692</option>
                        <option value="596">🇲🇶 Martinique +596</option>
                        <option value="222">🇲🇷 Mauritania +222</option>
                        <option value="269">🇾🇹 Mayotte +269</option>
                        <option value="52">🇲🇽 Mexico +52</option>
                        <option value="691">🇫🇲 Micronesia +691</option>
                        <option value="373">🇲🇩 Moldova +373</option>
                        <option value="377">🇲🇨 Monaco +377</option>
                        <option value="976">🇲🇳 Mongolia +976</option>
                        <option value="1664">🇲🇸 Montserrat +1664</option>
                        <option value="212">🇲🇦 Morocco +212</option>
                        <option value="258">🇲🇿 Mozambique +258</option>
                        <option value="95">🇲🇲 Myanmar +95</option>
                        <option value="264">🇳🇦 Namibia +264</option>
                        <option value="674">🇳🇷 Nauru +674</option>
                        <option value="977">🇳🇵 Nepal +977</option>
                        <option value="31">🇳🇱 Netherlands +31</option>
                        <option value="687">🇳🇨 New Caledonia +687</option>
                        <option value="64">🇳🇿 New Zealand +64</option>
                        <option value="505">🇳🇮 Nicaragua +505</option>
                        <option value="227">🇳🇪 Niger +227</option>
                        <option value="234">🇳🇬 Nigeria +234</option>
                        <option value="683">🇳🇺 Niue +683</option>
                        <option value="672">🇳🇫 Norfolk Islands +672</option>
                        <option value="670">🇲🇵 Northern Marianas +670</option>
                        <option value="47">🇳🇴 Norway +47</option>
                        <option value="968">🇴🇲 Oman +968</option>
                        <option value="680">🇵🇼 Palau +680</option>
                        <option value="507">🇵🇦 anama +507</option>
                        <option value="675">🇵🇬 Papua New Guinea +675</option>
                        <option value="595">🇵🇾 Paraguay +595</option>
                        <option value="51">🇵🇪 Peru +51</option>
                        <option value="63">🇵🇭 Philippines +63</option>
                        <option value="48">🇵🇱 Poland +48</option>
                        <option value="351">🇵🇹 Portugal +351</option>
                        <option value="1787">🇵🇷 Puerto Rico +1787</option>
                        <option value="974">🇶🇦 Qatar +974</option>
                        <option value="262">🇷🇪 Reunion +262</option>
                        <option value="40">🇷🇴 Romania +40</option>
                        <option value="7">🇷🇺 Russia +7</option>
                        <option value="250">🇷🇼 Rwanda +250</option>
                        <option value="378">🇸🇲 San Marino +378</option>
                        <option value="239">🇸🇹 Sao Tome &amp; Principe +239</option>
                        <option value="966">🇸🇦 Saudi Arabia +966</option>
                        <option value="221">🇸🇳 +221</option>
                        <option value="381">🇷🇸 Serbia +381</option>
                        <option value="248">🇸🇨 Seychelles +248</option>
                        <option value="232">🇸🇱 Sierra Leone +232</option>
                        <option value="65">🇸🇬 Singapore +65</option>
                        <option value="421">🇸🇰 Slovak Republic +421</option>
                        <option value="386">🇸🇮 Slovenia +386</option>
                        <option value="677">🇸🇧 Solomon Islands +677</option>
                        <option value="252">🇸🇴 Somalia +252</option>
                        <option value="27">🇿🇦 South Africa +27</option>
                        <option value="34">🇪🇸 Spain +34</option>
                        <option value="94">🇱🇰 Sri Lanka +94</option>
                        <option value="290">🇸🇭 St. Helena +290</option>
                        <option value="1869">🇰🇳 St. Kitts +1869</option>
                        <option value="1758">🇱🇨 St. Lucia +1758</option>
                        <option value="249">🇸🇩 Sudan +249</option>
                        <option value="597">🇸🇷 Suriname +597</option>
                        <option value="268">🇸🇿 Swaziland +268</option>
                        <option value="46">🇸🇪 Sweden +46</option>
                        <option value="41">🇨🇭 Switzerland +41</option>
                        <option value="963">🇸🇾 Syria +963</option>
                        <option value="886">🇹🇼 Taiwan +886</option>
                        <option value="7">🇹🇯 Tajikstan +7</option>
                        <option value="66">🇹🇭 Thailand +66</option>
                        <option value="228">🇹🇬 Togo +228</option>
                        <option value="676">🇹🇴 Tonga +676</option>
                        <option value="1868">🇹🇹 Trinidad &amp; Tobago +1868</option>
                        <option value="216">🇹🇳 Tunisia +216</option>
                        <option value="90">🇹🇷 Turkey +90</option>
                        <option value="7">🇹🇲 Turkmenistan +7</option>
                        <option value="993">🇹🇲 Turkmenistan +993</option>
                        <option value="1649">🇹🇨 Turks &amp; Caicos Islands +1649</option>
                        <option value="688">🇹🇻 Tuvalu +688</option>
                        <option value="256">🇺🇬 Uganda +256</option>
                        <option value="44">🇬🇧 United Kingdom +44</option>
                        <option value="380">🇺🇦 Ukraine +380</option>
                        <option value="971">🇦🇪 United Arab Emirates +971</option>
                        <option value="598">🇺🇾 Uruguay +598</option>
                        <option value="1">🇺🇸 United States +1</option>
                        <option value="7">🇺🇿 Uzbekistan +7</option>
                        <option value="678">🇻🇺 Vanuatu +678</option>
                        <option value="379">🇻🇦 Vatican City +379</option>
                        <option value="58">🇻🇪 Venezuela +58</option>
                        <option value="84">🇻🇳 Vietnam +84</option>
                        <option value="84">🇻🇬 Virgin Islands - British +1284</option>
                        <option value="84">🇻🇮 Virgin Islands - US +1340</option>
                        <option value="681">🇼🇫 Wallis &amp; Futuna +681</option>
                        <option value="969">🇾🇪 Yemen North+969</option>
                        <option value="967">🇾🇪 Yemen South+967</option>
                        <option value="260">🇿🇲 Zambia +260</option>
                        <option value="263">🇿🇼 Zimbabwe +263</option>
                      </optgroup>
                    </select>
                    <Field
                      name="phone-number" 
                      className='form-control-custom form-control-custom-ex phone-number'
                      component={fieldCleave}
                      propsCleave={{
                        options: { blocks: [4 , 4, 4], delimiter: '-', numeral: true, numeralThousandsGroupStyle: 'none' }
                      }}
                    />
                    <Button className="send-btn">Send</Button>
                  </div>
                  <p className="text">Enter vertiifycation code to your phone</p>
                  <Field
                    name="sms-code"
                    className='form-control-custom form-control-custom-ex w-100'
                    component={fieldCleave}
                    propsCleave={{
                      options: { numeral: true, numeralThousandsGroupStyle: 'none' },
                    }}
                  />
                  <Button className="submit-btn">Vertify your number</Button>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({emailCollapse: !state.emailCollapse}))}>
                <p className="label">Email Verification</p>
                <div className="extend">
                  <Image className={this.state.emailCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow"/>
                </div>
              </div>
              <div className={`content ${this.state.emailCollapse ? '' : 'd-none'}`}>
                <p className="text">In order to protect the security of your account, please add your email.</p>
                <p className="text">Enter your email</p>
                <EmailForm onSubmit={this.verifyEmail}>
                  <Field
                    name="phone-number" 
                    className='form-control-custom form-control-custom-ex w-100'
                    component={fieldCleave}
                    propsCleave={{
                    }}
                  />
                  <Button className="submit-btn">Vertify your email</Button>
                </EmailForm>
              </div>
            </div>
          </Col>
        </Row>
        <ModalDialog onRef={modal => this.modalVerifyRef = modal}>
          <div className="modal-verify">
            <Image src={CheckedSVG} alt="checked" />
            <p>Successed!</p>
            <p>Your authentication phone number is verified</p>
          </div>
        </ModalDialog>
      </Grid>
    );
  }
}

Profile.propTypes = {
  setHeaderTitle: PropTypes.func,
};

const mapState = state => ({

});

const mapDispatch = ({
  setHeaderTitle,
});

export default connect(mapState, mapDispatch)(Profile);
