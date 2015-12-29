var mongoose    = require('mongoose');

// user

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  nickname: String
}, {
	collection: "user"
});

var User = mongoose.model('user', userSchema);


// token

var tokenSchema = mongoose.Schema({
	body: String,
	expire: Number
}, {
	collection: "token"
})

var Token = mongoose.model('token', tokenSchema);


module.exports.Models = {
	User: User,
	Token: Token
}