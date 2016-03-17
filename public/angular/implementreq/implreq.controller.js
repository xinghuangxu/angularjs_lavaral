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
        .controller('ImplReq', ImplReq);

    ImplReq.$inject = [ '$scope', '$popover', 'ImplementationRequestsService' ];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function ImplReq ($scope, $popover, ImplementationRequestsService) {

        var vm = this;

        vm.config = {
                groupBy: ImplementationRequestsService.views,
                activeGroup: ImplementationRequestsService.views.NONE,
                popoverButtons: ImplementationRequestsService.btns
            };

        $scope.$on('planSettingChanged', function(event,settings) {
            var testplan_boxcar_id = settings.data.testplan_boxcar_id;
            ImplementationRequestsService.getImplementationRequestsData().then(function(response){
                vm.tree=ImplementationRequestsService.getTreeJson(response);
            });
            // The following lines have been commented out because we are going to use them once we change to the new service 
//            if(settings.data.testplan_boxcar_id)
//            {
//               ImplementationRequestsService.getImplementationRequestsData().then(function(response){
//
//                    vm.tree=ImplementationRequestsService.getTreeJson(response);
//
//                });
//            }

          });

    }
})();