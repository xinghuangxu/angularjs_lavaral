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

    TestCase.$inject = [ '$scope', '$popover', 'TestCaseService'];
    /**
     * Controller for handling TestCase pane in the test planner view
     */
    function TestCase ($scope, $popover, TestCaseService) {

        var vm = this;

        vm.config = {
                groupBy: TestCaseService.views,
                activeGroup: TestCaseService.views.NONE,
                popoverButtons: TestCaseService.btns
            };

        vm.tree = getTreeData;

        $scope.$on('planSettingChanged', function(event,settings) {
            if (settings.data.alm_db_name && settings.data.stack_name.match(/^LSIP2/)){
                vm.tree = getTreeData;
            }
          });

        function getTreeData(obj,cb){
            var node_id = obj.id;
            if (node_id == '#'){
                TestCaseService.getFolders().then(function(response){
                    cb.call(this, TestCaseService.getTreeJson(response));
                });
                return;
            }

            TestCaseService.getTestCases(node_id).then(function(response){
                cb.call(this, TestCaseService.getTestCaseTreeJson(response));
            });
            return;
        };
    }
})();
