/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';
    angular
        .module('testStrategy')
        .controller('testStrategyController', testStrategyController,suggestedTestStrategiesValue);


    testStrategyController.$inject=[ ];


    function testStrategyController(){

        var TSCtrl = this;
        TSCtrl.suggestedTestStrategies = getSuggestedTestStrategies;


    }
})();
