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
        .controller('TestCase', TestCase);

    TestCase.$inject = [ '$scope', '$popover', 'TestCaseService', 'testplanSettingsService', 'releasesService', 'testStackService'];
    /**
     * Controller for handling TestCase pane in the test planner view
     */
    function TestCase ($scope, $popover, TestCaseService, planSettings) {
        
        var vm = this;
        
        vm.config = {
                groupBy: TestCaseService.views,
                activeGroup: TestCaseService.views.NONE,
                popoverButtons: TestCaseService.btns
            };        
            
        $scope.$watch(function () {
            return planSettings.data.testplan_stack_id;
        },
                function () {
                    if (planSettings.data.testplan_stack_id) {
                        TestCaseService.getFoldersAndServiceData(planSettings.data.testplan_stack_id,
                                function (data) {
                                    if (data.length > 0)
                                        vm.tree=TestCaseService.getTreeJson(data)
//                                        planSettings.data = data[0];
                                });
                    }
                }
        );

//        TestCaseService.getFoldersAndServiceData().then(function(response){
//
//             vm.tree=TestCaseService.getTreeJson(response);
//
//        });

    }
})();
