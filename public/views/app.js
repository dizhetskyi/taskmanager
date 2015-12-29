define(['jquery', 'underscore', 'backbone', 'text!templates/app.html', 'backboneForms'], 
	function($, _, BB, AppTemplate){

	var AppView = BB.View.extend({

		template: _.template(AppTemplate),

		initialize: function(){
			_.extend(this, {test1: 2}, {test2: 5});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}

	});

	return AppView;
})