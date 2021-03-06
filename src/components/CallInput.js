import React from 'react';
import Axios from 'axios';

import {Form, Panel} from 'react-bootstrap';

export class CallInput extends React.Component {


  render() {
    return (
      <div>
      <Panel bsStyle='primary'>
        <Panel.Heading>
          <Panel.Title componentClass="h3">This is the call component</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          Extension: 
          <input type="text" name="" id="ext"/>
          Number: 
          <input type="text" name="" id="num"/>
          <button onClick={ (e) => {
    
            //Rough draft : choose with DOM selector and insert value - Change later to be bound to state.
            const numToCall = document.querySelector('input#num').value;
            const extCalling = document.querySelector('input#ext').value;
    
            console.log(`Sending call from extension ${extCalling} to number ${numToCall}`);
    
            Axios.post(`http://localhost:3000/place/${numToCall}`, {
              extCalling,
              numToCall
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
          }  
          }>Call!</button>
        </Panel.Body>
      </Panel>
      </div>
    );
  };
  
} 
export default CallInput;