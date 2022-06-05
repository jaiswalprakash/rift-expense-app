const express  = require('express');
var mysql      = require('mysql');
const myConnection = require('express-myConnection');
var bodyParser = require('body-parser');
const path = require('path');

var cors = require('cors') ; 


const app = express()

var whitelist = ['http://localhost:3000', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

 
 app.use(myConnection(mysql,{
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'riftsettler'
}, 'single' ));

 
  app.use('/user', require('./routes/user'));
  app.use('/personal', require('./routes/personal'));
  app.use('/addGroup', require('./routes/addGroup'));
  
app.listen(3000,function (req, res) {
    console.log('Listening to port 3000')
  
});