/**
 * Created by p684j362 on 4/27/2016.
 */

(function(){

    'use strict';

    angular
        .module('testPlanner')
        .service('testPlannerServices', testPlannerServices);

    testPlannerServices.$inject = ['$http', 'pluginNamesConstant'];

    function testPlannerServices($http, pluginNamesConstant){

        this.getReleases = getReleases;
        this.getStackLayer = getStackLayer;
        this.getSubStackLayer = getSubStackLayer;

        function getReleases(){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer+'/rest/cq/releases/',
                params: {
                    fields: 'name'
                }
            });
        }

        function getStackLayer(releaseID){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer+'/rest/planner/stacks',
                params: {
                    release: releaseID,
                    optionsList: true
                }
            });
        }

        function getSubStackLayer(stackID){
            return $http({
                method: 'GET',
                url: pluginNamesConstant.plugins_config.endpointServer+'/rest/planner/stacks/'+ stackID + '/substacks',
                params: {
                    optionsList: true
                }
            });
        }

    }

})();
