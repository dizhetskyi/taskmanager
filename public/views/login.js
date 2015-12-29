define(['jquery', 'underscore', 'backbone', 'text!templates/login.html'], 
	function($, _, BB, LoginForm){

	var RequiredValidator = function(options){
		
		this.required = true;

		this.errors = [];

		for(key in options){
			if (this.hasOwnProperty(key)){
				this.key = options[key];
			}
		}
	}
	RequiredValidator.prototype.validateValue = function(value){
		if (this.required){
			if (value === ''){
				this.errors.push('Is required');
			}
		}
	}
	
	var LoginFormView = BB.View.extend({
		
		id: 'login-form',				
		template: _.template(LoginForm),

		events: {
			'submit form': 'login'
		},
		fields: function(){
			return {
				'username': 'Username',
				'password': 'Password'
			}
		},
		errors: [],
		rules: function(){
			return [
				{
					field: 'username',
					validators: [{
						type: RequiredValidator,
						options: {
							required: true
						}
					}]
				},
				{
					field: 'password',
					validators: [{
						type: RequiredValidator,
						options: {
							required: true
						}
					}]
				}				
			]
		},

		initialize: function(){
		},
		
		render: function(){
			this.$el.html(this.template({}))
			this.$form = this.$('form');
			return this;
		},
		
		login: function(){

			if (!this.beforeFormSubmit()) return false;
			
			$.post('/api/login', this.$form.serialize(), function(res){
				
				if (res.success){
					window.localStorage.setItem('token', res.token);
					console.log('authorization complete, now rule the app!');
				} else {
					alert(res.errorMessage);
				}

			}, 'json')

			return false;

		},

		beforeFormSubmit: function(){
			var hasErrors = false;
			if (this.rules()){
				this.rules().forEach(function(rule){

					var $group = this.$('[data-group="'+ rule.field +'"]');
					var inputVal = this.$('[data-field="'+ rule.field +'"]').val();
					var $errorBox = this.$('[data-error="'+ rule.field +'"]');
					
					rule.validators.forEach(function(validator){

						var v = new validator.type;
						
						v.validateValue(inputVal, validator.options);

						if (v.errors.length){
							hasErrors = true;

							$group.toggleClass('has-error', true);
							$errorBox.toggleClass('hidden', false).html(v.errors[0]);
						} else {
							$group.toggleClass('has-error', false);
							$errorBox.toggleClass('hidden', true).empty();
						}

					}, this);					

				}, this)
			}
			return !hasErrors;
		}
	})

	return LoginFormView;
})