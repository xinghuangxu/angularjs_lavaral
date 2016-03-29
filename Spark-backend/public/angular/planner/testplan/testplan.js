/**
 * Controllers for Spark test planning test plan module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */

(function() {
    'use strict';

    angular
        .module('spark.planner.testplan')
        .controller('TestPlan', TestPlan);

    TestPlan.$inject = [ '$scope', 'testplanTreeService', 'testplanStrategyService', 'testplanSettingsService', 'globalFilterService', '$popover', '$modal' ];
    /**
     * Controller for handling test plan pane in the test planner view
     */
    function TestPlan ($scope, testplanTree, testplanStrategies, planSettings, filter, $popover, $modal) {
        var vm = this;
        vm.config = testplanTree.config;
        vm.tree = testplanTree;
        vm.settings = planSettings;
        vm.filter = filter;
        vm.strategies = testplanStrategies;
        vm.onSelect = selectNode;

        /**
         * Update the tree view when the sort selection changes
         */
        $scope.$watch(function() {
            return vm.config.activeGroup;
        }, function(newVal) {
            if(!newVal)
                return;

            testplanTree.buildTree(newVal);
        });

        /**
         * Fetch new data when the plan changes
         */
        $scope.$watch(function() {
            return vm.settings.data.id;
        }, function(newVal) {
            if(!newVal)
                return;

            testplanTree.get();
        });

        vm.comingSoonModal = function (){
            return $modal({
                title: "Coming Soon",
                content: "This feature will be Implemented soon!",
                animation: "am-fade-and-slide-top",
                contentTemplate: "angular/planner/testplan/comingSoonModal.tpl.html",
            });
        };

        /**
         * Event handler for selecting nodes in the tree
         *
         * @param {object} data Node and event data from jstree
         */
        function selectNode(data) {
         // Only open the popover for strategies. Can be extended later
            // TODO: Add more types to open popovers for; each can be handled with a different config
            if(data.node.original.type.name === "Test Strategy") {
                if(!data.event || !data.event.target) {
                    return;
                }

                var popScope = $scope.$new();
                popScope.edit = vm.strategies.open;
                popScope.del = vm.tree.del;
                popScope.data = data.node.data;

                var pop = $popover(
                    $(data.event.target),
                    {
                        html: true,
                        contentTemplate: '/angular/planner/testplan/stratPopover.tpl.html',
                        trigger: 'manual',
                        autoClose: true,
                        placement: 'bottom-left',
                        container: $(data.event.target  ),
                        scope: popScope
                    }
                );

                // Show once the popover initialization is done
                pop.$promise.then(pop.show);
            }
        }
    }
})();
