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

        vm.stack_name = null;

        // in production enviroment you should disable the following line

        vm.tree = getTreeData;

        // in production environment you should uncomment the following lines

//        $scope.$on('planSettingChanged', function(event,settings) {
//            if (settings.data.testplan_stack_id.match(/^LSIP2/)){
//                vm.stack_name = settings.data.testplan_stack_id;
//                vm.tree = getTreeData;
//            }
//        });

        function getTreeData(obj,cb){
            var node_id = obj.id;
            if (node_id == '#'){
                ImplementationRequestsService.getDevRequests(vm.stack_name).then(function(response){
                    cb.call(this, ImplementationRequestsService.getDevRequestTree(response));
                });
                return;
            }

            if (obj.data === "DevRequest"){
                ImplementationRequestsService.getImplRequests(vm.stack_name).then(function(response){
                    cb.call(this, ImplementationRequestsService.getImplRequestTree(response));
                });
                return;
            }
            else{
                ImplementationRequestsService.getTasks().then(function(response){
                    cb.call(this, ImplementationRequestsService.getTaskTree(response));
                });
                return;
            }
        };

    }
})();
