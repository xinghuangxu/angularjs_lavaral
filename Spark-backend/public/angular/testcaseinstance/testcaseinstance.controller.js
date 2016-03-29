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

    TestCaseInstance.$inject = [ '$scope', '$popover', 'TestCaseInstanceService'];
    /**
     * Controller for handling TestCaseInstance pane in the test planner view
     */
    function TestCaseInstance ($scope, $popover, TestCaseInstanceService) {

        var vm = this;

        vm.config = {
                groupBy: TestCaseInstanceService.views,
                activeGroup: TestCaseInstanceService.views.NONE,
                popoverButtons: TestCaseInstanceService.btns
            };
        vm.tree = getTreeData;

        $scope.$on('planSettingChanged', function(event,settings) {

            if (settings.data.stack_name.match(/^LSIP2/)){

                if(settings.data.alm_folder_node_id && settings.data.alm_db_name)
                {
                    vm.tree = getTreeData; 
                }

            }
          });
          
        function getTreeData(obj,cb){
            var node_id = obj.id;
            if (node_id == '#'){
                TestCaseInstanceService.getFolders(1).then(function(response){
                    cb.call(this, TestCaseInstanceService.getTreeJson(response));
                });
                return;
            }
            TestCaseInstanceService.getFolders(node_id).then(function(response){
                if (response.data.length > 0){
                    cb.call(this, TestCaseInstanceService.getTreeJson(response));
                }
                else{
                    TestCaseInstanceService.getTestSet(node_id).then(function(response){
                        if (response.data.length > 0){
                            cb.call(this, TestCaseInstanceService.getTestSetTreeJson(response));
                        }
                        else{
                            TestCaseInstanceService.getTestCaseInstance(node_id).then(function(){
                                cb.call(this, TestCaseInstanceService.getTestCasesInstanceTreeJson(response));
                            });
                            return;
                        }
                    });
                    return;
                }
            });
            return;
        };

    }
})();
