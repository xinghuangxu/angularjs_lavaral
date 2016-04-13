/**
 * Created by e897x724 on 3/21/2016.
 */
(function(){
    'use strict';

    angular
        .module('testStrategy')
        .service('testStrategyService',testStrategyService);

    testStrategyService.$inject= ['$http', 'pluginNamesConstant'];

    function testStrategyService($http, pluginNamesConstant){

        this.getTestStrategies = getTestStrategies;
        // Start of Implementation
        function getTestStrategies(type,search){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/',
                params:{
                    fields:'StrategyID,StrategyHeadline,State,Owner,ModifiedDate',
                    perpage:'all',
                    type:type,
                    search:search

                }
            });
        }


    }
})();
