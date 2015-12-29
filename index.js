// app settings 

var express     = require('express');
var app         = express();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var jwt         = require('jsonwebtoken');

app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.set('tokenSecret', '7Kilveak6G');


// database settings

var mongoose    = require('mongoose');
var Models = require('./utils/Models').Models;

mongoose.connect('mongodb://localhost:27017/taskManager');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db works');
});



// routes 

var apiRouter = express.Router();

apiRouter.post('/register', function(req, res){

  Models.User.find({username: req.body.username}, function(err, result){

    console.log(err, result);
    
    if (err) throw err;
    
    if (result.length){

      console.log('have this user');

      res.json({success: false, errorMessage: 'Username is not available, please pick another username'});

    } else {

      console.log('dont have this user');

      var newUser = new Models.User();

      newUser.username = req.body.username;
      newUser.password = req.body.password;

      newUser.save(function(err, model){
        
        if (err) throw err;

        res.json({success: true});

      })
    }

  })

  

})

apiRouter.post('/login', function(req, res){

  console.log(req.body.username)

  Models.User.findOne({username: req.body.username}, function(err, user){

    if (err) throw err;

    if (!user){
      res.json({success: false, errorMessage: 'Authentication failed. User not found.'});
    } else if (user) {
      
      if (user.password != req.body.password){
        res.json({success: false, errorMessage: 'Authentication failed. Wrong password.'});        
      } else {

        var tokenBody = new Buffer(user.username + user.password + '.' + new Date().getTime() + '.' + app.get('tokenSecret')).toString('base64');

        console.log(tokenBody);
        
        var token = new Models.Token({
          body: tokenBody,
          expire: new Date().getTime() / 1000 + 40 // in seconds, 2m
        })

        token.save(function(err, token){
          if (err) throw err;

          res.json({
            success: true,
            token: token.body
          });
        })        

      }
      
    }

  })  

})

// apiRoutes.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//       success: false, 
//       message: 'No token provided.' 
//     });
    
//   }
// });


apiRouter.get('/verifyToken', function(req, res) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token){

    Models.Token.findOne({body: token}, function(err, t){
      if (err) throw err;

      if (t){
        if (t.expire < new Date().getTime() / 1000){
          res.json({success: false, errorMessage: 'Token expired. Need authorization.'})
        } else {

          var decoded = new Buffer(t.body, 'base64').toString('utf-8');

          if (decoded.split('.')[2] === app.get('tokenSecret')){
            res.json({success: true});
          } else {
            res.json({success: false, errorMessage: 'Invalid token provided.'})
          }
        }
      } else {
        res.json({success: false, errorMessage: 'Invalid token provided.'})
      }

      
    });

  } else {
    res.json({success: false, errorMessage: 'No token provided.'})
  }

});   

app.use('/api', apiRouter);


// app start

app.listen('3030');