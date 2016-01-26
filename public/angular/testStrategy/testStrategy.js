/**
 * Primary controllers for the test strategy module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-08
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.testStrategy')
        .controller('Strategy', Strategy);

    Strategy.$inject = ['$routeParams', '$scope', 'strategyEditService', 'strategyViewService','testStrategyService', 'errorService'];
    /**
     * Parent strategy controller
     */
    function Strategy($routeParams, $scope, editService, viewService, strategyService, errorService) {
        var vm = this;
        vm.view = viewService;
        vm.edit = editService;
        
        // Get the ID to load, if it was set in the controller, route params, or service
        var strategyId = vm.id || $routeParams.strategyId || $scope.id;

        activate();

        /**
         * Initialize the controller
         */
        function activate() {
            if(strategyId) {
                strategyService.get({StrategyID: strategyId}).$promise
                    .then(function(data) {
                        editService.current = data;
                    })
                    .catch(function(error) {
                        errorService.error(error);
                    });
            }
        }
    }
})();