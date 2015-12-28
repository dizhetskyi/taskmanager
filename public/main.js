'use strict';

require.config({
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery',
			],
			exports: 'Backbone'
		},
		backboneForms: {
			deps: [
				'backbone'
			],
			exports: 'BackboneForms'
		},
		bootstrap: {
			deps: [
				'jquery'
			]
		}
	},
	paths: {
		jquery: '/bower_components/jquery/dist/jquery',
		underscore: '/bower_components/underscore/underscore',
		backbone: '/bower_components/backbone/backbone',
		backboneForms: '/bower_components/backbone-forms/distribution.amd/backbone-forms',
		text: '/bower_components/text/text',
		bootstrap: '/bower_components/bootstrap/dist/js/bootstrap',

	}
});

require(['jquery', 'underscore', 'backbone', 'app', 'router', 'views/app', 'bootstrap'], 
function ($, _, BB, App, AppRouter, AppView) {

	App.Routers.AppRouter = new AppRouter();
	Backbone.history.start();

});