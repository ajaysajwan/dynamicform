/* global angular */
(function() {

    'use strict';

    var app = angular.module('formlyExample', ['formly', 'formlyBootstrap']);

    app.run(function(formlyConfig) {
        formlyConfig.setType({
            name: 'ipAddress',
            extends: 'input',
            defaultOptions: {
                validators: {
                    ipAddress: {
                        expression: function(viewValue, modelValue) {
                            var value = modelValue || viewValue;
                            return /(\d{1,3}\.){3}\d{1,3}/.test(value);
                        },
                        message: '$viewValue + " is not a valid IP Address"'
                    }
                }
            }
        });
    });

    app.controller('MainCtrl', function MainCtrl(formlyVersion, User) {
        var vm = this;
        // funcation assignment
        vm.onSubmit = onSubmit;

        // variable assignment
        vm.author = { // optionally fill in your info below :-)
            name: 'Kent C. Dodds',
            url: 'https://twitter.com/kentcdodds' // a link to your twitter/github/blog/whatever
        };
        vm.exampleTitle = 'JSON powered'; // add this
        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        // Note, normally I prefer to use the router and resolve
        // async dependencies into my controller, but I think
        // this gives you the idea of what you're supposed to do...
        vm.loadingData = User.getUserData().then(function(result) {
            vm.model = result[0];
            vm.fields = result[1];
            vm.originalFields = angular.copy(vm.fields);
        });



        // function definition
        function onSubmit() {
            alert(JSON.stringify(vm.model), null, 2);
        }
    });

    app.factory('User', function($timeout, $q) {
        return {
            getFields: getFields,
            getUser: getUser,
            getUserData: getUserData
        };

        function getUserData() {
            return $q.all([getUser(), getFields()]);
        }

        function getUser() {
            return $timeout(function() {
                return {
                    "firstName": "Joan",
                    "lastName": "of Arc"
                };
            }, 100);
        }

        function getFields() {
            return $timeout(function() {
                return [{
                        "key": "firstName",
                        "type": "input",
                        "templateOptions": {
                            "label": "First Name"
                        }
                    }, {
                        "key": "lastName",
                        "type": "input",
                        "templateOptions": {
                            "label": "Last Name"
                        }
                    }, {
                        "key": "mac",
                        "type": "input",
                        "templateOptions": {
                            "label": "Mac Address",
                            "pattern": "([0-9A-F]{2}[:-]){5}([0-9A-F]{2})"
                        }
                    }, {
                        "key": "ipAddress",
                        "type": "ipAddress",
                        "templateOptions": {
                            "label": "IP Address"
                        }
                    }, {
						"key": "marvel1",
						"type": "select",
						"templateOptions": {
							"label": "Normal Select",
							"options": [{
								"name": "Iron Man",
								"value": "iron_man"
							}, {
								"name": "Captain America",
								"value": "captain_america"
							}, {
								"name": "Black Widow",
                                "value": "black_widow"
							}, {
								"name": "Hulk",
								"value": "hulk"
							}, {
								"name": "Captain Marvel",
								"value": "captain_marvel"
							}]
						}
					}, {
						"key": "marvel2",
						"type": "select",
						"templateOptions": {
							"label": "Grouped Select",
							"options": [{
								"name": "Iron Man",
								"value": "iron_man",
								"group": "Male"
							}, {
								"name": "Captain America",
								"value": "captain_america",
								"group": "Male"
							}, {
								"name": "Black Widow",
								"value": "black_widow",
								"group": "Female"
							}, {
								"name": "Hulk",
								"value": "hulk",
								"group": "Male"
							}, {
								"name": "Captain Marvel",
								"value": "captain_marvel",
								"group": "Female"
							}]
						}
					}, {
                        "key": "color",
                        "type": "radio",
                        "templateOptions": {
                            "label": "Color Preference (try this out)",
                            "options": [{
                                "name": "No Preference",
                                "value": null
                            }, {
                                "name": "Green",
                                "value": "green"
                            }, {
                                "name": "Blue",
                                "value": "blue"
                            }]
                        }
                    }, {
                        "key": "reason",
                        "type": "textarea",
                        "templateOptions": {
                            "label": "Why?"
                        },
                        // notice that you can still do expression properties :-)
                        "expressionProperties": {
                            "templateOptions.label": "'Why did you choose ' + model.color + '?'",
                            "hide": "!model.color"
                        },
                        // you can do validators too :-)
                        "validators": {
                            "containsAwesome": "$viewValue.indexOf('awesome') !== -1"
                        }
                    }
                ];
            }, 200);
        }
    });

})();
