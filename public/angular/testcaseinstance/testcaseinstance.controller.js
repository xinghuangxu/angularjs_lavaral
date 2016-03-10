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
        .controller('TestCaseInstance', TestCaseInstance);

    TestCaseInstance.$inject = [ '$scope', '$popover', 'TestCaseInstanceService' ];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function TestCaseInstance ($scope, $popover, TestCaseInstanceService) {

        var vm = this;

        vm.config = {
                groupBy: TestCaseInstanceService.views,
                activeGroup: TestCaseInstanceService.views.NONE,
                popoverButtons: TestCaseInstanceService.btns
            };

        TestCaseInstanceService.getServiceData().then(function(response){

             vm.tree=TestCaseInstanceService.getTreeJson(response);

        });

    $scope.$on('planSettingChanged', function(event,settings) {
    console.log('testInstance catch');
    var alm_db_name = settings.data.alm_db_name;
    var alm_folder_node_id = settings.data.alm_folder_node_id;

    if(alm_db_name && alm_folder_node_id)
    {
        TestCaseInstanceService.getServiceData().then(function(response){

             vm.tree=TestCaseInstanceService.getTreeJson(response);

        });
    }

  });

    }
})();
