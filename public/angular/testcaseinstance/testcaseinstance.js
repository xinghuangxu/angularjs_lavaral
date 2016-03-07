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

    TestCaseInstance.$inject = [ '$scope', '$popover', 'TestCaseInstanceTreeService', 'globalFilterService' ];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function TestCaseInstance ($scope, $popover, TestCaseInstanceTree, filter) {
        var vm = this;
        vm.config = TestCaseInstanceTree.config;
        vm.tree = TestCaseInstanceTree.data;
        vm.filter = filter;
        vm.selectNode = selectNode;

        /**
         * Update the tree view when the sort selection changes
         */
        
        $scope.$watch(function() {
            return vm.config.activeGroup;
        }, function(newVal) {
            if(!newVal)
                return;

            vm.tree = TestCaseInstanceTree.buildTree(newVal);
        });

        /**
         * Fetch scoping data from the TestCaseInstance service
         *
         * @param {string} TestCaseInstance  Boxcar to fetch data for
         */
        function getTreeData (TestCaseInstance) {
            vm.loading = true;
            var data = TestCaseInstanceScopes.get({TestCaseInstance: TestCaseInstance});
            data.$promise
                .then(function(data) {
                    TestCaseInstanceTree.parse(data);

                    vm.tree = TestCaseInstanceTree.buildTree(vm.config.activeGroup);
                })
                .finally(function() {
                    vm.loading = false;
                });
        }
        
        /**
         * Event which triggers whenever a node in the tree is selected
         * 
         * @param {object} data Node and event data from jstree
         */
        function selectNode (data) {
            // TODO: Add popover handling for HL scope
        }
    }
})();
