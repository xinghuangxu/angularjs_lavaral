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
        .controller('ArchDocs', ArchDocs);

    ArchDocs.$inject = [ '$scope', '$popover', 'archdocsTreeService', 'globalFilterService' ];
    /**
     * Controller for handling archdocs pane in the test planner view
     */
    function ArchDocs ($scope, $popover, archdocsTree, filter) {
        var vm = this;
        archdocsTree.get();
        vm.config = archdocsTree.config;
        vm.tree = archdocsTree.data;
        console.log("Data", archdocsTree);
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

            vm.tree = archdocsTree.buildTree(newVal);
        });

        /**
         * Fetch scoping data from the archdocs service
         *
         * @param {string} archdocs  Boxcar to fetch data for
         */
        function getTreeData (archdocs) {
            vm.loading = true;
            var data = archdocsScopes.get({archdocs: archdocs});
            data.$promise
                .then(function(data) {
                    archdocsTree.parse(data);

                    vm.tree = archdocsTree.buildTree(vm.config.activeGroup);
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
