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
        var vm = this;

        vm.config = {
                groupBy: archdocsService.views,
                activeGroup: archdocsService.views.NONE,
                popoverButtons: archdocsService.btns
            };

        $scope.$on('planSettingChanged', function(event,settings) {
            if(settings.data.testplan_boxcar_id)
            {
                archdocsService.getDocsAndTopicsData().then(function(response){

                    vm.tree=archdocsService.getTreeJson(response);

               });
            }

          });

    }
})();
