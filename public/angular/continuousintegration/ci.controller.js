/**
 * Controllers for Spark test planning Boxcar module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark')
        .controller('continuousIntegration', continuousIntegration);

    continuousIntegration.$inject = [ '$scope', '$popover', 'ContinuousIntegrationService' ];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function continuousIntegration ($scope, $popover, ContinuousIntegrationService) {

        var vm = this;

        vm.config = {
                groupBy: ContinuousIntegrationService.views,
            };
        
        ContinuousIntegrationService.getContinuousIntegrationData().then(function(response){
                vm.Ownertree=ContinuousIntegrationService.getTreeJson(response);
                vm.SearchResultree=ContinuousIntegrationService.getTreeJson(response);
                vm.Productstree=ContinuousIntegrationService.getTreeJson(response);
                vm.RuncheckTestTree=ContinuousIntegrationService.getTreeJson(response);
                vm.FeatureRegressionTestTree=ContinuousIntegrationService.getTreeJson(response);
                vm.ExecuteTestTree=ContinuousIntegrationService.getTreeJson(response);
            });
            
//        $scope.$on('planSettingChanged', function(event,settings) {
//            var testplan_boxcar_id = settings.data.testplan_boxcar_id;
//            ImplementationRequestsService.getImplementationRequestsData().then(function(response){
//                vm.tree=ImplementationRequestsService.getTreeJson(response);
//            });
            // The following lines have been commented out because we are going to use them once we change to the new service 
//            if(settings.data.testplan_boxcar_id)
//            {
//               ImplementationRequestsService.getImplementationRequestsData().then(function(response){
//
//                    vm.tree=ImplementationRequestsService.getTreeJson(response);
//
//                });
//            }

//          });

    }
})();
