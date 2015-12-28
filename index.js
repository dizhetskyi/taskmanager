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

app.set('superSecret', '7Kilveak6G');


// database settings

var mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost:27017/taskManager');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db works');
});

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  nickname: String
}, {
	collection: "user"
});

var User = mongoose.model('user', userSchema);


// routes 

var apiRouter = express.Router();

apiRouter.post('/register', function(req, res){

  User.find({username: req.body.username}, function(err, result){

    console.log(err, result);
    
    if (err) throw err;
    
    if (result.length){

      console.log('have this user');

      res.json({success: false, errorMessage: 'Username is not available, please pick another username'});

    } else {

      console.log('dont have this user');

      var newUser = new User();

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

  User.findOne({username: req.body.username}, function(err, user){

    if (err) throw err;

    console.log('1');
    
    if (!user){
      console.log('2');
      res.json({success: false, errorMessage: 'Authentication failed. User not found.'});
    } else if (user) {
      console.log('3');

      if (user.password != req.body.password){
        res.json({success: false, errorMessage: 'Authentication failed. Wrong password.'});        
      } else {

        console.log('4');

        var token = jwt.sign({
          userId: user.id
        }, app.get('superSecret'), {
          expires: 60*60*24 // in seconds, 24h
        });

        res.json({
          success: true,
          token: token
        });

      }
      
    }

  })

  

})

apiRouter.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

app.use('/api', apiRouter);


// app start

app.listen('3030');