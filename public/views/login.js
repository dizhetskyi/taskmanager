define(['jquery', 'underscore', 'backbone', 'text!templates/login.html'], 
	function($, _, BB, LoginForm){
	
	var LoginFormView = BB.View.extend({
		tagName: 'form',
		id: 'login-form',		
		events: {
			'click button': 'login'
		},
		template: _.template(LoginForm),
		render: function(){
			this.$el.html(this.template({

			}))
			return this;;
		},
		login: function(){
			
			$.post('/api/login', this.$el.serialize(), function(res){
				//var data = $.parseJSON(res);
				console.log(res);
				/*
				if (data.success){
					console.log(data.token);
				}*/
			}, 'json')
		}
	})

	return LoginFormView;
})