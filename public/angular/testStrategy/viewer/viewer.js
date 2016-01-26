/**
 * Strategy view directive
 * 
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 * 
 */

(function() {
    'use strict';

    angular
        .module('spark.testStrategy.viewer')
        .directive('sparkStrategyViewer', sparkStrategyViewer);

    function sparkStrategyViewer() {
        var wysiwyg = {
            menu: []
        };

        Viewer.$inject = ['$scope', 'strategyEditService', 'strategyViewService', 'testStrategyService', 'testplanTreeService', 'errorService'];
        /**
         * Controller handling editing
         * 
         * @param strategyEditService
         */
        function Viewer ($scope, editService, viewService, strategyService, planTreeService, errorService) {
            var vm = this;
            vm.wysiwyg = wysiwyg;
            vm.expanded = false;
            vm.service = viewService;
            vm.editService = editService;
            vm.stratService = strategyService;
            vm.planTree = planTreeService;

            vm.expand = expand;
            vm.shrink = shrink;

            vm.clear = clear;
            vm.edit = edit;
            vm.loadRev = loadRev;
            vm.loadVar = loadVar;

            vm.addToPlan = addToPlan;

            /**
             * Expand the wysiwyg editor
             */
            function expand() {
                vm.expanded = true;
            }

            /**
             * Shrink the wysiwyg editor
             */
            function shrink() {
                vm.expanded = false;
            }

            /**
             * Reset the editor
             */
            function clear() {
                vm.service.current = null;
            }
            
            function edit() {
                vm.editService.current = vm.service.current;
                clear();
            }

            /**
             * Load the selected revision instead of the current strategy
             */
            function loadRev() {
                // TODO: implement
            }

            /**
             * Load the selected variation instead of the current strategy
             */
            function loadVar() {
                // TODO: Implement
            }

            /**
             * Add the given strategy to the current plan, if any
             * 
             * @param {object} item Test strategy to add to the plan
             */
            function addToPlan(item) {
                vm.planTree.add(item);
            }
        }

        return {
            restrict: 'E',
            scope: {
                id: '=',
                viewer: '@'
            },
            templateUrl: 'angular/testStrategy/viewer/viewer.tpl.html',
            controller: Viewer,
            controllerAs: 'viewer',
            bindToController: true,
            link: function(scope, element, attrs, viewer) {
                 scope.$watch(function() {
                     return viewer.expanded;
                 }, function(newVal) {
                     if(newVal) {
                         element.find('div.fullscreen').addClass('fullscreen-active');
                     }
                     else {
                         element.find('div.fullscreen').removeClass('fullscreen-active');
                     }
                 });
            }
        };
    }
})();
