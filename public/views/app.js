define(['jquery', 'underscore', 'backbone', 'text!templates/app.html', 'backboneForms'], 
	function($, _, BB, AppTemplate){
	var AppView = BB.View.extend({
		template: _.template(AppTemplate),
		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return AppView;
})