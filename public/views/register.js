define(['jquery', 'underscore', 'backbone', 'text!templates/register.html'], 
	function($, _, BB, LoginForm){
	
	var LoginFormView = BB.View.extend({
		id: 'register-form',
		tagName: 'form',
		events: {
			'click button': 'register'
		},
		template: _.template(LoginForm),
		render: function(){
			this.$el.html(this.template({

			}))
			return this;;
		},
		register: function(){
			
			$.post('/api/register', this.$el.serialize(), function(res){				
				
				if (res.success){
					Backbone.history.navigate('#/login');
				} else {
					alert(res.errorMessage);
				}

			}, 'json')

		}
	})

	return LoginFormView;
})