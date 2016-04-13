/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';
    angular
        .module('testStrategy')
        .controller('testStrategyController', testStrategyController);


    testStrategyController.$inject=['SISSuggestionsValue','testStrategyService'];


    function testStrategyController(SISSuggestionsValue,testStrategyService){

        var TSCtrl = this;
        TSCtrl.SISSuggestionsValue = SISSuggestionsValue;

        TSCtrl.getCoreTestStrategies = getCoreTestStrategies;
        TSCtrl.getPlaceHolderTestStrategies = getPlaceHolderTestStrategies;
        TSCtrl.getSearchTestStrategies = getSearchTestStrategies;
        
        function getCoreTestStrategies() {

            !TSCtrl.coreTestStrategies&&
            testStrategyService.getTestStrategies('c').then(function(data){
                TSCtrl.coreTestStrategies=data;

            })
        }
        function getPlaceHolderTestStrategies() {
            TSCtrl.placeHolderTestStrategies&&
            testStrategyService.getTestStrategies('pc').then(function(data){
                TSCtrl.placeHolderTestStrategies=data;

            })

        }
        function getSearchTestStrategies(search_text) {
            TSCtrl.searchTestStrategies&&
            testStrategyService.getTestStrategies(null,search_text).then(function(data){
                TSCtrl.searchTestStrategies=data;

            })
            
        }

    }
})();
