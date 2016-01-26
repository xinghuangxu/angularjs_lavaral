/**
 * Primary controllers for the testcase module
 *
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-15
 *
 */
(function() {
    'use strict';
    // Parent module, used in dependency injection and resolution
    angular
        .module('spark.testcase')
        .controller('AddTestCase', AddTestCase);

    AddTestCase.inject = ['$scope', 'testcaseService', 'almFolderService', 'errorService'];
    /**
     * Controller for the modal to search and add test cases
     * @param $scope
     * @param tagService
     * @param errorService
     */
    function AddTestCase($scope, testcaseService, errorService) {
        var vm = this;
        vm.search = search;
        
        /**
         * Search the database for testcases
         * 
         * @param {object} $event Optional event data for handling keypress events
         */
        function search($event) {
            if(!vm.searchTerm || ($event && $event.type === 'keypress' && event.keyCode !== 13)) {
                // Skip empty searches and non-enter keypress events
                return;
            }
            
            vm.loading = true;
            testcaseService.get({search: vm.searchTerm}).$promise
                .then(function(data) {
                    vm.results = data;
                }).catch(function(error) {
                    errorService.error('Error loading search results');
                }).finally(function() {
                    vm.loading = false;
                });
        }
        
    }
})();
