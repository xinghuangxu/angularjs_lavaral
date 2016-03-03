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

    ImplReq.$inject = [ '$scope', '$popover', 'implreqTreeService', 'globalFilterService' ];
    /**
     * Controller for handling implreq pane in the test planner view
     */
    function ImplReq ($scope, $popover, implreqTree, filter) {
        var vm = this;
        implreqTree.get();
        vm.config = implreqTree.config;
        vm.tree = implreqTree.data;
        console.log("Data", implreqTree);
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

            vm.tree = implreqTree.buildTree(newVal);
        });

        /**
         * Fetch scoping data from the implreq service
         *
         * @param {string} implreq  Boxcar to fetch data for
         */
        function getTreeData (implreq) {
            vm.loading = true;
            var data = implreqScopes.get({implreq: implreq});
            data.$promise
                .then(function(data) {
                    implreqTree.parse(data);

                    vm.tree = implreqTree.buildTree(vm.config.activeGroup);
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
