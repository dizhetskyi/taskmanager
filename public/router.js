'use strict';

define(['backbone', 'app', 'views/app', 'views/login', 'views/register'], 
	function(BB, App, AppView, LoginFormView, RegisterFormView){

	var AppRouter = BB.Router.extend({
		initialize: function(){
			this.on('route', function(r){
				console.log('route: ' + r);
			})
		},
		routes: {
			'': 'index',
			'login': 'login',
			'register': 'register'
		},
		index: function(){

			$('#app').html(new AppView().render().el);

		},
		login: function(){

			$('#app').html(new LoginFormView().render().el);

		},
		register: function(){

			$('#app').html(new RegisterFormView().render().el);

		}
	});

	return AppRouter;

})