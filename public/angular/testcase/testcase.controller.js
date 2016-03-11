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

        $scope.$on('planSettingChanged', function(event,settings) {

            TestCaseService.getFoldersAndServiceData().then(function(response){

                vm.tree=TestCaseService.getTreeJson(response);

           });

          });




    }
})();
