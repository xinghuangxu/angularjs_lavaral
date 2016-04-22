/**
 * Created by p684j362 on 4/22/2016.
 */

(function(){
    'use strict';
    
    angular
        .module('testStrategyManager')
        .service('strategyViewerServices', strategyViewerServices);

    strategyViewerServices.$inject = ['$http', 'pluginNamesConstant'];
    
    function strategyViewerServices($http, pluginNamesConstant){
        
        this.getStrategyDetails = getStrategyDetails; 
        
        function getStrategyDetails(id){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/' + id
            });
        }
    }
})();
