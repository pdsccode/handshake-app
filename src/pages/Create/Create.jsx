import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Creates, { maps as createMaps } from '@/components/Create';
import Button from '@/components/core/controls/Button';
import Modal from '@/components/core/controls/Modal';
import CommentsContainer from '@/components/Comment/CommentsContainer';

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seletedId: 0
    }
    this.change = ::this.change;
  }

  change(e) {
    this.setState({ seletedId: parseInt(e.target.value) });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div>
              <select defaultValue={this.state.seletedId} onChange={this.change}>
                {createMaps.map(
                  (item, index) => (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </div>
            <Creates id={this.state.seletedId} />
            <Button block onClick={() => this.modalRef.open()}>Show comment modal</Button>
          </Col>
        </Row>
        <Row>
          <Modal ref={(component) => { this.modalRef = component; }} title="comment">
            <CommentsContainer />
          </Modal>
        </Row>
      </Grid>
    );
  }
}

export default Create;
