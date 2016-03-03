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
        .controller('AddTestCase', AddTestCase)
        .controller('TestCaseCTRL', TestCaseCTRL);

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
    
    TestCaseCTRL.inject = [ '$scope', '$popover', 'TestCaseTreeService', 'globalFilterService' ];
    
    function TestCaseCTRL ($scope, $popover, TestCaseTree, filter) {
        var vm = this;
        TestCaseTree.get();
        vm.config = TestCaseTree.config;
        vm.tree = TestCaseTree.data;
        console.log("Data", TestCaseTree);
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

            vm.tree = TestCaseTree.buildTree(newVal);
        });

        /**
         * Fetch scoping data from the TestCase service
         *
         * @param {string} TestCase  Boxcar to fetch data for
         */
        function getTreeData (TestCase) {
            vm.loading = true;
            var data = TestCaseScopes.get({TestCase: TestCase});
            data.$promise
                .then(function(data) {
                    TestCaseTree.parse(data);

                    vm.tree = TestCaseTree.buildTree(vm.config.activeGroup);
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
