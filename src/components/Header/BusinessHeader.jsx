import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/Button/Button';
import logo from '@/assets/images/logo-capital.svg';
import { URL } from '@/config';

class BusinessHeader extends React.Component {
  render() {
    return (
      <header className="app-header">
        <Grid>
          <Row>
            <Col sm={12}>
              <div className="logo-container">
                <Link to={URL.BUSINESS.INDEX}>
                  <img src={logo} alt=""/>
                  {/* <span>Capital</span> */}
                </Link>
              </div>
              <div className="float-right right">
                <Button immunity cssType="secondary" to={URL.BUSINESS.SIGN_OUT} link>Sign out</Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </header>
    );
  }
}

export default BusinessHeader;
