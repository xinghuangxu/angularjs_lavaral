/**
 * Controllers for the requirements selection services
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-14
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.requirements')
        .controller('AddRequirements', AddRequirements);

    AddRequirements.$inject = ['$scope', 'requirementsService', 'errorService'];
    /**
     * Controller for the modal to search and add requirements
     */
    function AddRequirements($scope, reqService, errorService) {
        var vm = this;
        
        vm.types = [
            {
                name: 'Architectural Documents',
                val: 'archdocs'
            },
            {
                name: 'Manual Requirements',
                val: 'adhocs'
            }
        ];
        
        vm.search = search;
        
        /**
         * Trigger a search on the database for requirements
         * 
         * @param {object} $event Optional event data for handling keypress events
         */
        function search($event) {
            if($event && $event.type === 'keypress' && event.keyCode !== 13) {
                // Skip non-enter keypress events
                return;
            }
            if(!vm.searchTerm || !vm.reqType) {
                // Don't search if no string to search on or no type selected
                return;
            };
            
            var service = reqService[vm.reqType];
            vm.loading = true;
            service({search: vm.searchTerm}).$promise
                .then(function(data) {
                    vm.result = data;
                }).catch(function(error) {
                    errorService.error('Error searching for requirements');
                }).finally(function() {
                    vm.loading = false;
                });
        }
    }
})();
