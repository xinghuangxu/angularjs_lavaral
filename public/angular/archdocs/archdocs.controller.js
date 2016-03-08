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

    ArchDocs.$inject = [ '$scope', '$popover', 'archdocsService' ];
    /**
     * Controller for handling archdocs pane in the test planner view
     */
    function ArchDocs ($scope, $popover, archdocsService) {

        archdocsService.getDocsAndTopicsData().then(function(response){

             $scope.tree=archdocsService.getTreeJson(response);

        });

    }
})();
