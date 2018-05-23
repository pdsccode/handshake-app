import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Input from '@/components/core/forms/Input/Input';
//import FormRender from '@/components/core/forms/Form/FormRender';

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;


class BettingDetail extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        
      }
    static defaultProps = {
        item: {
            "backgroundColor": "#332F94",
            "desc": "[{\"key\": \"event_date\", \"placeholder\": \"Event date\", \"type\": \"date\"}] [{\"key\": \"event_info\", \"placeholder\": \"Event info\"}] [{\"key\": \"outcome\", \"placeholder\": \"Outcome\"}] [{\"key\": \"odd\", \"placeholder\": \"Odd\"}] [{\"key\": \"bet\", \"placeholder\": \"Bet in ETH\", \"type\": \"number\"}]",
            "id": 18,
            "message": null,
            "name": "Bet",
            "order_id": 5,
            "public": 1
        }
    
    }
    renderItem(field, index) {
        console.log('Field:', field);
        //var item = field.length > 0 ? field[0] : {}
        //console.log('Item:', item);
        const item = JSON.parse(field.replace(regexReplace, ''));
        console.log('item:', item);
        const {key, placeholder, type} = item;
        console.log('Key:', key);
        return (
            <div key={index}>
            <div>
                {placeholder}
            </div>
            <div>
            <Input name={key}/>
            </div>
            </div>
        );
    }
    get inputList(){
        const content = this.content;
        return content ? content.match(regex) : [];
    }

    get content(){
        const {item} = this.props;
        const {desc} = item;
        const content = desc ? desc : '';
        return content;
    }
  render() {
      const inputList = this.inputList;
      console.log('Input List:', inputList);
    return (
        <div>
           {inputList.map((field, index)=>
              this.renderItem(field, index)
           )}
        </div>
    );
  }
}

export default BettingDetail;
