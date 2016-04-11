/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';
    angular
        .module('testStrategy')
        .controller('testStrategyController', testStrategyController);


    testStrategyController.$inject=['SISSuggestionsValue'];


    function testStrategyController(SISSuggestionsValue){

        var TSCtrl = this;
        TSCtrl.SISSuggestionsValue = SISSuggestionsValue;


    }
})();
