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

    TestCaseInstance.$inject = [ '$scope', '$popover', 'TestCaseInstanceService' ];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function TestCaseInstance ($scope, $popover, TestCaseInstanceService) {

        TestCaseInstanceService.getDocsAndTopicsData().then(function(response){

             $scope.tree=TestCaseInstanceService.getTreeJson(response);

        });

    }
})();
