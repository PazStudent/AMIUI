const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const {server , user , password} = require('./conf/asterisk-conf');
const ami = new require('asterisk-manager')('5038', server, user, password, true);
console.log('Processing queue status request.');
ami.keepConnected();
let now = moment.now()
ami.on('registry' , function(event) {
  console.log('Time since last emitted event is: ' ,moment(moment.now() - now).from(0));
  console.log(event);
  now = moment.now();
});
 
const app = express();
const publicPath = path.join(__dirname, '..' , 'public');
const port = process.env.PORT || 3000;

const {placeCall} = require('./api/callDispatcher');
const {getQueueStatus} = require('./api/queueInformation');
const {getPeerStatus} = require('./api/peerInformation');


//Add some wierdo event listener:


app.use(express.static(publicPath));
app.use(bodyParser.json());

app.post('/place/:number' , (req , res , next) => {
  console.log(req);
  const {extCalling,numToCall} = req.body;
  console.log('body: ' , req.body);
  placeCall(numToCall,extCalling);
  res.send('Handled');
  next();
});

app.post('/queue/:queue' , async (req , res , next) => {
  console.log('body: ' , req.body);
  const queue = req.params.queue;
  const result = await getQueueStatus(queue);
  console.log(result);
  res.send(result);
  next();
  
});


app.post('/peers' , async (req , res , next) => {
  console.log('body: ' , req.body);
  const peer = req.body.peer;
  const result = await getPeerStatus(peer);
  console.log(result);
  res.send(result);
  next();
  
});

app.get('*' ,(req , res , next) => {
  if(req.path.includes('/place')){
    next();
  } else {
    try {
      res.sendFile(path.join(publicPath , 'index.html'));
    } catch(e){
      console.log('Errrror! : ' , e);
    };
  }
  
  
});

app.listen(port , () => {
  console.log('server is up on port' , port);
});