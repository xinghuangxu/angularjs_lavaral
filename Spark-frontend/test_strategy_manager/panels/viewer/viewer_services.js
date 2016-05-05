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
        this.promoteTestStrategy = promoteTestStrategy;
        this.demoteTestStrategy = demoteTestStrategy;
        this.obsoleteTestStrategy = obsoleteTestStrategy;
        this.approveTestStrategy = approveTestStrategy;
        this.varyTestStrategy = varyTestStrategy;
        this.reviewTestStrategy = reviewTestStrategy;
        function getStrategyDetails(id){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/' + id
            });
        }
        function promoteTestStrategy(id){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/promote'
            });
        }
        function demoteTestStrategy(id){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/demote'
            });
        }

        function obsoleteTestStrategy(id){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/obsolete'
            });
        }

        function approveTestStrategy(id){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/approve'
            });
        }

        function varyTestStrategy(){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/vary'
            });
        }

        function reviewTestStrategy(){
            return $http({
                method: 'POST',
                url: pluginNamesConstant.plugins_config.endpointServer + '/rest/strategies/'+ id +'/rev'
            });
        }
    }
})();