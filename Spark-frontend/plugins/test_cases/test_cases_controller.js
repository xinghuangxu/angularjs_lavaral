/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';
    angular.module('testCases').controller('testCasesController',testCasesController);
    testCasesController.$inject=[];
    function testCasesController(){
        var testCasesController= this;
        testCasesController.example_tree = [{
            "id": 1,
            "parent": "#",
            "text": "Root 1"
        }, {
            "id": 2,
            "parent": "#",
            "text": "Root 2"
        }, {
            "id": 3,
            "parent": 2,
            "text": "Child 1"
        }, {
            "id": 4,
            "parent": 2,
            "text": "Child 2"
        }];


    }
})();