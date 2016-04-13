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
            testStrategyService.getTestStrategies('c').then(function(resp){

                TSCtrl.coreTestStrategies=testStrategyService.getTreeJson(resp.data);

            })
        }
        function getPlaceHolderTestStrategies() {

            testStrategyService.getTestStrategies('pc').then(function(resp){
                TSCtrl.placeHolderTestStrategies=testStrategyService.getTreeJson(resp.data);

            })
        }
        function getSearchTestStrategies(search_text) {

            testStrategyService.getTestStrategies(null,search_text).then(function(resp){
                TSCtrl.searchTestStrategies=testStrategyService.getTreeJson(resp.data);

            })
        }
    }
})();