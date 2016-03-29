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
        .module('spark.planner.boxcar')
        .controller('Boxcar', Boxcar);

    Boxcar.$inject = [ '$scope', '$popover', 'boxcarTreeService', 'boxcarScopeService', 'testplanSettingsService', 'globalFilterService' ];
    /**
     * Controller for handling boxcar pane in the test planner view
     */
    function Boxcar ($scope, $popover, boxcarTree, boxcarScopes, planSettings, filter) {
        var vm = this;
        vm.config = boxcarTree.config;
        vm.tree = boxcarTree.data;

        vm.settings = planSettings.data;
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

            vm.tree = boxcarTree.buildTree(newVal);
        });

        /**
         * Fetch new data when the boxcar changes
         */
        $scope.$watch(function() {
            return vm.settings.testplan_stack_id;
        }, function(newVal) {
            if(!newVal)
                return;

            // Only fetch data when the current stack is a boxcar
            if(newVal.match(/^LSIP2/)) {
                getTreeData(newVal);
            }
        });

        /**
         * Fetch scoping data from the boxcar service
         *
         * @param {string} boxcar  Boxcar to fetch data for
         */
        function getTreeData (boxcar) {
            vm.loading = true;
            var data = boxcarScopes.get({boxcar: boxcar});
            data.$promise
                .then(function(data) {
                    boxcarTree.parse(data);

                    vm.tree = boxcarTree.buildTree(vm.config.activeGroup);
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
