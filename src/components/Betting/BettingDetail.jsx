import React from 'react';
import PropTypes from 'prop-types';

import Input from '@/components/core/forms/Input/Input';
//import FormRender from '@/components/core/forms/Form/FormRender';
import Button from '@/components/core/controls/Button/Button';
const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;


class BettingDetail extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        toAddress: PropTypes.string.isRequired,
        isPublic: PropTypes.bool.isRequired,
        industryId: PropTypes.number.isRequired,
        onClickSend:PropTypes.func
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
    constructor(props) {
        super(props);
        this.state = {
            values: []
        };
    }
    renderItem(field, index) {
        console.log('Field:', field);
        //var item = field.length > 0 ? field[0] : {}
        //console.log('Item:', item);
        const item = JSON.parse(field.replace(regexReplace, ''));
        console.log('item:', item);
        const {key, placeholder, type} = item;
        console.log('Key:', key);
        console.log('Type:', type);
        var itemRender =  (<div key={index}>
        <label>
            {placeholder}
            <Input name={key} onChange={(evt) => { this.changeText(key, evt.target.value)}}/>

        </label>
      
        </div>);
        switch(type){
            case 'date':
            itemRender = (<div key={index}>
                <label>
                    {placeholder}
                    <Input name={key} onChange={(evt) => { this.changeText(key, evt.target.value)}}/>

                </label>
                </div>);
            break;
            case 'number':
            itemRender = (<div key={index}>
                <label>
                    {placeholder}
                    <Input name={key} type='number' min='1' defaultValue='1' onChange={(evt) => { this.changeText(key, evt.target.value)}}/>
                </label>
            
                </div>);
            break;

        }
        return itemRender;
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
    onClickSendButton(){
        console.log('onClickSendButton');
        const {values} = this.state;
        var content = this.content;
        const inputList = this.inputList;
        //const listBlank = content ? content.match(regex) : [];
        //console.log('List Blank:', listBlank);
        console.log('Values:', values);
        let extraParams = values;
        console.log('Before Content:', content);

        inputList.forEach(element => {
            const item = JSON.parse(element.replace(regexReplace, ''));
            console.log('Element:', item);
            const {key, placeholder, type} = item;
            const valueInputItem = values[key];

            content = content.replace(
                regexReplacePlaceholder,
                valueInputItem ? valueInputItem : ''
              );
        });
        console.log('After Content:', content);

        const {toAddress, isPublic, industryId} = this.props;

        //this.props.onClickSend(params);
        const params = {
            to_address: toAddress ? toAddress.trim() : '',
            public: isPublic,
            description: content,
            industries_type: industryId,
            //source: Platform.OS
          };

          
    }
    changeText(key, text){
        console.log('Text:', text);
        const {values} = this.state;
        values[key] = text;
        this.setState({
            values
        })
    }
  render() {
      const inputList = this.inputList;
      console.log('Input List:', inputList);
    return (
        <div>
           {inputList.map((field, index)=>
              this.renderItem(field, index)
           )}
           <Button onClick={()=> this.onClickSendButton()}>Sign & Send</Button>
        </div>
    );
  }
}

export default BettingDetail;
